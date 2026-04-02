const dateFormatter = (locale: string) => new Intl.DateTimeFormat(locale, { dateStyle: "long" })

export { dateFormatter }
