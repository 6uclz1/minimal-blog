import sanitizeHtml from 'sanitize-html';

export const sanitizeContent = (content: string): string => {
    return sanitizeHtml(content, {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat([
            'img',
            'h1', 'h2', 'h3', 'h4', 'h5', 'h6'
        ]),
        allowedAttributes: {
            ...sanitizeHtml.defaults.allowedAttributes,
            'img': ['src', 'alt', 'title', 'width', 'height'],
            'a': ['href', 'name', 'target']
        },
        allowedSchemes: ['http', 'https', 'mailto', 'tel']
    });
};
