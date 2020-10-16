export interface Language {
    code: string;
    description: string;
}

export type LanguageCode = Pick<Language, "code">