//Wait Utils

const isPromise = (obj) => {
    return !!obj &&
        (typeof obj === 'object' || typeof (obj) === 'function') &&
        ((obj.constructor && obj.constructor.name === 'Promise') || typeof (obj.then) === 'function');
};

const wait = function (ms) {
    return new Promise((resolve) => {
        if (ms) {
            setTimeout(resolve, ms);
        } else {
            setImmediate(resolve);
        }
    });
};

const waitUntil = function (handler, timeout = 3000, interval = 100) {
    return new Promise(async (resolve) => {

        let resFirst = await handler();
        if (resFirst) {
            resolve(resFirst);
            return;
        }

        let interval_id;
        let timeout_id;

        timeout_id = setTimeout(() => {
            clearInterval(interval_id);
            resolve();
        }, timeout);

        interval_id = setInterval(async () => {
            let resCheck = await handler();
            if (!resCheck) {
                return;
            }
            clearTimeout(timeout_id);
            clearInterval(interval_id);
            resolve(resCheck);
        }, interval);

    });
};

const waitU = function (input) {
    if (typeof (input) === "function" || isPromise(input)) {
        return waitUntil.apply(this, arguments);
    }
    return wait.apply(this, arguments);
};

waitU.isPromise = isPromise;
waitU.wait = wait;
waitU.waitUntil = waitUntil;
module.exports = waitU;