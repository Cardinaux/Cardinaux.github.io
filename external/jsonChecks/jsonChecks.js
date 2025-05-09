export function jsonChecks(json) {
    return new JsonChecks(json);
}

class JsonChecks {
    constructor(json) {
        this.json = json;
        this.checks = [];
    }

    isArray() {
        this.checks.push(() => [
            this.json instanceof Array,
            `is not array`
        ]);
        return this;
    }

    isObject() {
        this.checks.push(() => [
            this.json instanceof Object,
            `is not object`
        ]);
        return this;
    }

    keyExists(key) {
        this.checks.push(() => [
            key in this.json,
            `key '${key}' does not exist`
        ]);
        return this;
    }

    keyTypeOf(key, type) {
        this.keyExists(key);
        this.checks.push(() => [
            typeof this.json[key] === type,
            `key '${key}' is not typeof ${type} but instead ${typeof this.json[key]}`
        ]);
        return this;
    }

    keyInstanceOf(key, type) {
        this.keyExists(key);
        this.checks.push(() => [
            this.json[key] instanceof type,
            `key '${key}' is not instanceof ${type.constructor.name} but instead ${this.json[key].constructor.name}`
        ]);
        return this;
    }

    keyIsArray(key) {
        return this.keyInstanceOf(key, Array);
    }

    keyIsObject(key) {
        return this.keyInstanceOf(key, Object);
    }

    keyIsString(key) {
        return this.keyTypeOf(key, "string");
    }

    keyIsNumber(key) {
        return this.keyTypeOf(key, "number");
    }

    keyIsBoolean(key) {
        return this.keyTypeOf(key, "boolean");
    }

    check() {
        this.checks.forEach((check) => {
            if (!check()[0]) {
                return false;
            }
        });
        return true;
    }

    checkOrExcept() {
        this.checks.forEach((check) => {
            const [ok, msg] = check();
            if (!ok) {
                throw new Error(msg);
            }
        });
    }
}