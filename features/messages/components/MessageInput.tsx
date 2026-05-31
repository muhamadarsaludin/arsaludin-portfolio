import { useState } from "react";
import { Message, MessageType } from "../types/messages.types";
import { useAuth } from "@/providers/AuthProvider";
import { useTranslations } from "next-intl";
import { useMessageMutation } from "../hooks/useMessageMutation";
import { cn } from "@/utils/class-name";
import { LuSend, LuX } from "react-icons/lu";
import MiracleTextArea from "@/components/miracle/TextArea";
import MiracleButton from "@/components/miracle/Button";
import { SiGoogle } from "react-icons/si";
import { signInWithGoogle } from "@/features/auth/services/auth";

type MessageInputProps = {
  messageType: MessageType
  pageSize: number
  repliedMessage: Message | null
  onClearReply: () => void
  className?: string
};

export default function MessageInput({
  messageType,
  pageSize,
  repliedMessage,
  onClearReply,
  className
}: MessageInputProps) {
  const [text, setText] = useState("")
  const { isSignedIn } = useAuth()
  const t = useTranslations("components.message.input")
  const { send, isSending } = useMessageMutation({ type: messageType, pageSize})

  const handleSend = () => {
    const cleanContent = text.trim()
    if (!cleanContent || !isSignedIn) return
    send({
      content: cleanContent,
      replyToId: repliedMessage?.id ?? null,
      recipientId: repliedMessage?.user_id ?? null,
      recipient: repliedMessage?.author ?? null,
      repliedMessage: repliedMessage ?? null,
    })
    onClearReply()
    setText("")
  }

  const handleSignIn = async () => {
    await signInWithGoogle()
  }

  return (
    <div className={cn("flex flex-col gap-3 border-t border-primary pt-5 md:pt-6", className)}>
      {repliedMessage && (
        <div className="bg-primary animate-in fade-in slide-in-from-bottom-2 flex items-start gap-2 duration-300">
          <div className="border-blue flex flex-1 flex-col gap-1.5 border-l-4 py-1 pl-3">
            <p className="text-secondary flex items-center gap-1 text-xs font-bold">
              {t("replyingTo")}:
              <span className="text-blue">@{repliedMessage.author.full_name}</span>
            </p>
            <div className="bg-secondary w-full overflow-hidden rounded-lg p-2">
              <p className="text-secondary line-clamp-2 text-[11px] leading-relaxed italic">
                "{repliedMessage.content}"
              </p>
            </div>
          </div>

          <button
            onClick={onClearReply}
            type="button"
            aria-label={t("cancelReply")}
            className="ml-auto cursor-pointer rounded-full p-2 transition-colors duration-300 ease-in-out hover:bg-neutral-200 dark:hover:bg-neutral-800"
          >
            <LuX size={14} />
          </button>
        </div>
      )}

      <div className="flex items-start gap-2">
        <div className="flex-1">
          <MiracleTextArea
            placeholder={
              !isSignedIn
                ? t("loginRequired")
                : repliedMessage
                  ? `${t("replyingTo")} @${repliedMessage.author.full_name} ...`
                  : t("placeholder")
            }
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={isSending || !isSignedIn}
            fullWidth
            helperText={
              isSignedIn && !isSending && (
                <span className="flex items-center gap-1 opacity-60">
                  <span className="font-semibold">Enter</span> {t("toSend")} • <span className="font-semibold">Shift + Enter</span> {t("newLine")}
                </span>
              )
            }
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSend()
              }
            }}
          />
        </div>
        <MiracleButton
          className="shrink-0"
          onClick={handleSend}
          size="sm"
          aria-label="Send message"
          loading={isSending}
          disabled={!text.trim() || !isSignedIn}
          startIcon={<LuSend />}
          isSquare
        />
      </div>

      {!isSignedIn && (
        <MiracleButton onClick={handleSignIn} startIcon={<SiGoogle />} fullWidth>
          {t("signIn")}
        </MiracleButton>
      )}
    </div>
  )
}
