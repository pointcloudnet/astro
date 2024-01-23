/// <reference types="lucia" />
declare namespace Lucia {
    // type Auth = import('./lib/lucia/lucia').Auth;
    type Auth = import('./auth/lib/lucia').Auth;
    type DatabaseUserAttributes = {
        username: string;
    };
    type DatabaseSessionAttributes = {};
}

/// <reference types="astro/client" />
declare namespace App {
    interface Locals {
        auth: import('lucia').AuthRequest;
    }
}
