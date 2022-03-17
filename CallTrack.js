const Data_Types = Object.freeze({
    Number: 'number',
    String: 'string',
    Boolean: 'boolean',
    Array: 'array',
    Object: 'object'
});


/*
* @name: CallTracker
* @author: adnan
* @description: very simple javascript function wrapper to keep  track of function calls and pre-checking the parameter types
* */
function CallTrack() {
    'use strict'
    const funcTrace = Object.create(null)

    const funcWrapper = func => {
        if (typeof (func) !== 'function') {
            throw TypeError(`Expected a Function. Found a ${typeof func}.\nInvalid Parameter.Cannot Trace. `)
        }
        return (...args) => {
            if (funcTrace[func.name] === 0 || isNaN(funcTrace[func.name])) {
                funcTrace[func.name] = 1;
            } else {
                funcTrace[func.name] += 1;
            }

            return func(...args);
        }
    }

    const typeSafeFuncWrapper = func => {
        if (typeof (func) !== 'function') {
            throw TypeError(`Expected a Function. Found a ${typeof func}.\nInvalid Parameter.Cannot Trace. `)
        }
        return (...args) => {
            const params = []
            args.forEach(e => {
                if (typeof (e) === 'object' && e.hasOwnProperty('data') && e.hasOwnProperty('type')) {
                    if (e.type === Data_Types.Number) {
                        if (typeof (e.data) === 'number') {
                            params.push(e.data);
                        } else {
                            throw TypeError(`Expected ${e.type}\nFound: ${typeof e.data}`);
                        }
                    } else if (e.type === Data_Types.String) {
                        if (typeof (e.data) === 'string') {
                            params.push(e.data);
                        } else {
                            throw TypeError(`Expected ${e.type}\nFound: ${typeof e.data}`);
                        }
                    } else if (e.type === Data_Types.Boolean) {
                        if (typeof (e.data) === 'boolean') {
                            params.push(e.data);
                        } else {
                            throw TypeError(`Expected ${e.type}\nFound: ${typeof e.data}`);
                        }
                    } else if (e.type === Data_Types.Array) {
                        if (Array.isArray(e.data)) {
                            params.push(e.data);
                        } else {
                            throw TypeError(`Expected ${e.type}\nFound: ${typeof e.data}`);
                        }
                    } else if (e.type === Data_Types.Object) {
                        if (!Array.isArray(e.data) && typeof (e.data) === 'object') {
                            params.push(e.data);
                        } else {
                            throw TypeError(`Expected ${e.type}\nFound: ${typeof e.data}`);
                        }
                    } else {
                        throw TypeError('Unknown Type Error');
                    }
                } else {
                    throw Error('Unknown Format Found');
                }
            });


            if (funcTrace[func.name] === 0 || isNaN(funcTrace[func.name])) {
                funcTrace[func.name] = 1;
            } else {
                funcTrace[func.name] += 1;
            }
            //console.log(params);
            return func(...params);
        }
    }


    const trackeByName = name => {
        return funcTrace[name];
    }


    return {funcWrapper,typeSafeFuncWrapper, trackeByName};
}

function addTwo(a,b) {
    return a+b;
}

//first initialize  instance of CallTracker
const tracker = CallTrack();

//then wrap  it with funcWrapper or typeSafeFuncWrapper
const addCaller = tracker.typeSafeFuncWrapper(addTwo);

// pass parameters specifying its type so the wrapper can pre-check the type of arguments before executing your business logic
const result = addCaller({type: Data_Types.Number,data:5},{type: Data_Types.Number,data: 10})
const result1 = addCaller({type: Data_Types.Number,data:4},{type: Data_Types.Number,data: 81})

// simply use the function name to track how many times it's been called
const callCount = tracker.trackeByName('addTwo');

console.log(`Result of addTwo Func: ${result}\nResult1 of addTwo Func: ${result1}\nCalled: ${callCount}`);

// it will throw error
const result2 = addCaller({type: Data_Types.Number,data:4},{type: Data_Types.Number,data: '82'})