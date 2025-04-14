import helmet from 'helmet';

export default helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            frameAncestors: ["'self'"],                     // Prevents integration into an unauthorized iframe
            scriptSrc: ["'self'"],                          // Enables secure internal scripting
        },
    },
    crossOriginEmbedderPolicy: true,                        // Enhanced security for resources loaded via cross-origin
    crossOriginOpenerPolicy: { policy: "same-origin" },     // Prevents pop-up attacks
    crossOriginResourcePolicy: { policy: "same-origin" },   // Protects external resources
    dnsPrefetchControl: { allow: false },                   // Disables DNS caching
    frameguard: { action: "deny" },                         // Prevents the use of iframes
    hsts: { maxAge: 63072000, includeSubDomains: true },    // Strict Transport Security
    ieNoOpen: true,                                         // Prevents IE from executing malicious files
    referrerPolicy: { policy: "no-referrer" },              // Controls information sent in the Referrer header
    xssFilter: true,                                        // Adds protection against XSS attacks
})