// Model Response Status 200
export class Response200 {
    constructor(message, data) {
        this.status = 200;
        this.message = String(message ?? "");

        if (Array.isArray(data)) {
            this.data = data;
        } else if (typeof data === "object" && data !== null) {
            this.data = data;
        } else {
            this.data = {};
        }

        this.success = true;
    }
}

// Model Response Status 202
export class Response202 {
    constructor(message, data) {
        this.status = 202;
        this.message = String(message ?? "");

        if (Array.isArray(data)) {
            this.data = data;
        } else if (typeof data === "object" && data !== null) {
            this.data = data;
        } else {
            this.data = {};
        }

        this.success = true;
    }
}

// Model Response Status 400
export class Response400 {
    constructor(message, errorCode, details = []) {
        this.status = 400;
        this.message = String(message ?? "Error de validación");
        this.error = {
            code: String(errorCode ?? "VALIDATION_ERROR"),
            details: Array.isArray(details) ? details : []
        };
        this.success = false;
    }
}

// Model Response Status 401
export class Response401 {
    constructor(message, errorCode) {
        this.status = 401;
        this.message = String(message ?? "Unauthorized");
        this.error = { code: String(errorCode ?? "UNAUTHORIZED") };
        this.success = false;
    }
}

// Model Response Status 403
export class Response403 {
    constructor(message, errorCode) {
        this.status = 403;
        this.message = String(message ?? "Forbidden");
        this.error = { code: String(errorCode ?? "FORBIDDEN") };
        this.success = false;
    }
}

// Model Response Status 404
export class Response404 {
    constructor(message, errorCode) {
        this.status = 404;
        this.message = String(message ?? "Not found");
        this.error = { code: String(errorCode ?? "NOT_FOUND") };
        this.success = false;
    }
}

// Model Response Status 409
export class Response409 {
    constructor(message, errorCode, conflicts = [], custom = {}) {
        this.status = 409;
        this.message = String(message ?? "Conflict");
        this.error = {
            code: String(errorCode ?? "CONFLICT"),
            conflicts: Array.isArray(conflicts) ? conflicts : [],
            custom: custom instanceof CustomParam409 ? custom : {}
        };
        this.success = false;
    }
}

export class CustomParam409 {
    constructor(alertCode, tab, first, second, third, fontColor, backColor, data) {
        this.alertCode = alertCode != null ? Number(alertCode) : null;
        this.tab = String(tab ?? "");
        this.warnings = {
            first: String(first ?? ""),
            second: String(second ?? ""),
            third: String(third ?? "")
        };
        this.alertColors = {
            font: String(fontColor ?? ""),
            back: String(backColor ?? "")
        };
        this.data = data;
    }
}

// Model Response Status 422
export class Response422 {
    constructor(message, errorCode) {
        this.status = 422;
        this.message = String(message ?? "Unprocessable Entity");
        this.error = { code: String(errorCode ?? "UNPROCESSABLE_ENTITY") };
        this.success = false;
    }
}

// Model Response Status 500
export class Response500 {
    constructor(message, errorCode) {
        this.status = 500;
        this.message = String(message ?? "Internal server error");
        this.error = { code: String(errorCode ?? "INTERNAL_SERVER_ERROR") };
        this.success = false;
    }
}

