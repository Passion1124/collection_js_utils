/**
 * @Description: 28 个 JavaScript 技巧
 * @author Passion
 * @date 2019/5/31
 */

// 1.判断对象的数据类型
const isType = type => target => `[object ${type}]` === Object.prototype.toString.call(this);
const isArray = isType('Array');
console.log(isArray([])); // true
/* 使用 Object.prototype.toString 配合闭包，通过传入不同的判断类型来返回不同的判断函数，一行代码，简洁优雅灵活（注意传入 type 参数时首字母大写）
不推荐将这个函数用来检测可能会产生包装类型的基本数据类型上,因为 call 会将第一个参数进行装箱操作*/

// 2. ES5 实现数组 map 方法
const selfMap = function (fn, context) {
    let arr = Array.prototype.slice.call(this);
    let mappedArr = [];
    for (let i = 0; i < arr.length; i++) {
        if (!arr.hasOwnProperty(i)) continue;
        mappedArr.push(fn.call(context, arr[i], i, this))
    }
    return mappedArr
};

/*值得一提的是，map 的第二个参数为第一个参数回调中的 this 指向，如果第一个参数为箭头函数，那设置第二个 this 会因为箭头函数的词法绑定而失效
另外就是对稀疏数组的处理，通过 hasOwnProperty 来判断当前下标的元素是否存在与数组中(感谢评论区的朋友)*/

// 3. 使用 reduce 实现数组 map 方法
const selfMap2 = function (fn, context) {
    let arr = Array.prototype.slice.call(this);
    return arr.reduce((pre, cur, index) => {
        return [...pre, fn.call(context, cur, index, this)]
    }, [])
};

// 4. ES5 实现数组 filter 方法
const selfFilter = function (fn, context) {
    let arr = Array.prototype.slice.call(this);
    let filteredArr = [];
    for (let i = 0; i < arr.length; i++) {
        if (!arr.hasOwnProperty(i)) continue;
        fn.call(context, arr[i], i, this) && filteredArr.push(arr[i]);
    }
    return filteredArr
};

// 使用 reduce 实现数组 filter 方法
const selfFilter2 = function (fn, context) {
    return this.reduce((pre, cur, index) => {
        return fn.call(context, cur, index, this) ? [...pre, cur] : [...pre]
    }, [])
};

// 6. ES5 实现数组的 some 方法
const selfSome = function (fn, context) {
    let arr = Array.prototype.slice.call(this);
    if (!arr.length) return false;
    let flag = false;
    for (var i = 0; i < arr.length; i++) {
        if (!arr.hasOwnProperty(i)) continue;
        let res = fn.call(context, arr[i], i, this);
        if (res) {
            flag = true;
            break;
        }
    }
    return flag
};

/*执行 some 方法的数组如果是一个空数组，最终始终会返回 false，而另一个数组的 every 方法中的数组如果是一个空数组，会始终返回 true*/

// 7. ES5 实现数组的 reduce 方法
const selfReduce = function (fn, initialValue) {
    let arr = Array.prototype.slice.call(this);
    if (initialValue) arr.unshift(initialValue);
    let res = arr[0];
    for (var i = 0; i < arr.length - 1; i++) {
        if (!arr.hasOwnProperty(i + 1)) continue;
        res = fn.call(null, res, arr[i + 1], initialValue === undefined ? i + 1 : i, arr)
    }
    return res
};
/*当初始值不存在时，下标从 1 开始计算，当初始值存在时，下标从 0 开始计算*/

// 8. 使用 reduce 实现数组的 flat 方法
const selfFlat = function (depth = 1) {
    let arr = Array.prototype.slice.call(this);
    if (depth === 0) return arr;
    return arr.reduce((pre, cur) => {
        if (Array.isArray(cur)) {
            return [...pre, ...selfFlat.call(cur, depth - 1)]
        } else {
            return [...pre, cur];
        }
    }, [])
};

/*因为 selfFlat 是依赖 this 指向的，所以在 reduce 遍历时需要指定 selfFlat 的 this 指向，否则会默认指向 window 从而发生错误
原理通过 reduce 遍历数组，遇到数组的某个元素仍是数组时，通过 ES6 的扩展运算符对其进行降维（ES5 可以使用 concat 方法），而这个数组元素可能内部还嵌套数组，所以需要递归调用 selfFlat
同时原生的 flat 方法支持一个 depth 参数表示降维的深度，默认为 1 即给数组降一层维度

传入 Inifity 会将传入的数组变成一个一维数组

原理是每递归一次将 depth 参数减 1，如果 depth 参数为 0 时，直接返回原数组*/

// 9. 实现 ES6 的 class 语法
function inherit(subType, superType) {
    subType.prototype = Object.create(superType.prototype, {
        constructor: {
            enumerable: false,
            configurable: true,
            writable: true,
            value: superType.constructor
        }
    });
    // 继承函数
    Object.setPrototypeOf(subType, superType)
}

/*ES6 的 class 内部是基于寄生组合式继承，它是目前最理想的继承方式，通过 Object.create 方法创造一个空对象，并将这个空对象继承 Object.create 方法的参数，再让子类（subType）的原型对象等于这个空对象，就可以实现子类实例的原型等于这个空对象，而这个空对象的原型又等于父类原型对象（superType.prototype）的继承关系
而 Object.create 支持第二个参数，即给生成的空对象定义属性和属性描述符/访问器描述符，我们可以给这个空对象定义一个 constructor 属性更加符合默认的继承行为，同时它是不可枚举的内部属性（enumerable:false）
而 ES6 的 class 允许子类继承父类的静态方法和静态属性，而普通的寄生组合式继承只能做到实例与实例之间的继承，对于类与类之间的继承需要额外定义方法，这里使用 Object.setPrototypeOf 将 superType 设置为 subType 的原型，从而能够从父类中继承静态方法和静态属性*/

// 10. 函数柯里化
function curry(fn) {
    if (fn.length <= 1) return fn;
    const generator = (...args) => {
        if (fn.length === args.length) {
            return fn(...args)
        } else {
            return (...args2) => {
                return generator(...args, ...args2)
            }
        }
    };
    return generator
}
// 使用方法：
let add = (a, b, c, d) => a + b + c + d;
const curriedAdd = curry(add);
curriedAdd(5)(6)(7)(8); // == add(5, 6, 7, 8) == 5 + 6 + 7 +8
/*柯里化是函数式编程的一个重要技巧，将使用多个参数的一个函数转换成一系列使用一个参数的函数的技术
函数式编程另一个重要的函数 compose，能够将函数进行组合，而组合的函数只接受一个参数，所以如果有接受多个函数的需求并且需要用到 compose 进行函数组合，就需要使用柯里化对准备组合的函数进行部分求值，让它始终只接受一个参数*/

// 11. 函数柯里化（支持占位符）
const nCurry = (fn, placeholder = '_') => {
    nCurry.placeholder = placeholder;
    if (fn.length <= 1) return fn;
    let argsList = [];
    const generator = (...args) =>{
        let currentPlaceholderIndex = -1; // 防止当前轮元素覆盖了当前轮的占位符
        args.forEach(arg => {
            let placeholderIndex = argsList.findIndex(arg => arg === nCurry.placeholder);
            if (placeholderIndex < 0) {
                // 如果没有占位符直接往数组末尾放入一个元素
                currentPlaceholderIndex = argsList.push(arg) - 1;
            } else if (placeholderIndex !== currentPlaceholderIndex) {
                // 防止将真实元素填充到当前轮元素的占位符
                argsList[placeholderIndex] = arg
            } else {
                argsList.push(arg);
            }
        });
        let realArgList = argsList.filter(arg => arg !== nCurry.placeholder); // 过滤出不含占位符的真实数组
        if (realArgList.length === fn.length) {
            return fn(...argsList);
        } else if (realArgList.length > fn.length) {
            throw new Error('超出初始函数参数最大值');
        } else {
            return generator
        }
    };
    return generator
};

// 使用方法
// 方法1
let add11 = (a, b, c, d) => a + b + c + d;
const curriedAdd11 = nCurry(add11);
curriedAdd11('_', 6)(5, '_')(7)(8); // == add11(5)(6)(7)(8) == 26
// 方法2
let display = (a, b, c, d, e, f, g, h) => [a, b, c, d, e, f, g, h];
const curriedDisplay = nCurry(display);
curriedDisplay('_', 2)(1, '_')(3)(4, '_',)('_', 5)(6)(7, 8); // == display(1, 2, 3, 4, 5, 6, 7, 8) === [1, 2, 3, 4, 5, 6, 7, 8];
/*通过占位符能让柯里化更加灵活，实现思路是，每一轮传入的参数先去填充上一轮的占位符，如果当前轮参数含有占位符，则放到内部保存的数组末尾，当前轮的元素不会去填充当前轮参数的占位符，只会填充之前传入的占位符*/

// 12. 偏函数
const partialFunc = (func, ...args) => {
    let placeholderNum = 0;
    return (...args2) => {
        args2.forEach(arg => {
            let index = args.findIndex(item => item === '_');
            if (index < 0) return;
            args[index] = arg;
            placeholderNum++;
        });
        if (placeholderNum < args2.length) {
            args2 = args2.slice(placeholderNum, args2.length);
        }
        console.log(args);
        console.log(args2);
        return func.apply(this, [...args, ...args2]);
    }
};

// 使用方法
let add12 = (a, b, c, d) => a + b + c + d;
let partialAdd2 = partialFunc(add12, '_', 2, '_');
partialAdd2(1, 3, 4); // === add12(1, 2, 3 ,4) === 10

/*
* 偏函数和柯里化概念类似，个人认为它们区别在于偏函数会固定你传入的几个参数，再一次性接受剩下的参数，而函数柯里化会根据你传入参数不停的返回函数，直到参数个数满足被柯里化前函数的参数个数
Function.prototype.bind 函数就是一个偏函数的典型代表，它接受的第二个参数开始，为预先添加到绑定函数的参数列表中的参数，与 bind 不同的是，上面的这个函数同样支持占位符
*/

// 13. 斐波那契数列及其优化
const speed = function (fn, num) {
    console.time('time');
    let value = fn(num);
    console.timeEnd('time');
    console.log(`返回值:${value}`)
};

let  fibonacci = function (n) {
    if (n < 1) throw new Error('参数有误');
    if (n === 1 || n === 2) return 1;
    return fibonacci(n - 1) + fibonacci(n - 2);
};

speed(fibonacci, 35);


//函数记忆
const memory = function (fn) {
    let obj = {};
    return function (n) {
        if (obj[n] === undefined) obj[n] = fn(n);
        return obj[n]
    }
};
fibonacci = memory(fibonacci);

speed(fibonacci, 35);

/*利用函数记忆，将之前运算过的结果保存下来，对于频繁依赖之前结果的计算能够节省大量的时间，例如斐波那契数列，缺点就是闭包中的 obj 对象会额外占用内存*/

//14. 实现函数 bind 方法
const isComplexDateType = obj => (typeof obj === 'object' || typeof obj === 'function') && obj !== null;
const selfBind = function (bindTarget, ...args1) {
    if (typeof this !== 'function') throw new Error('Bind must be called on a function');
    let func = this;
    let boundFunc = function (...args2) {
        let args = [...args1, ...args2];
        if (new.target) {
            let res = func.apply(this, args);
            if (isComplexDateType(res)) return res;
            return this;
        } else {
            func.apply(bindTarget, args);
        }
    };
    this.prototype && (boundFunc.prototype = Object.create(this.prototype));
    let desc = Object.getOwnPropertyDescriptor(func);
    Object.defineProperties(boundFunc, {
        length: desc.length,
        name: Object.assign(desc.name, {
            value: `bound${desc.name.value}`
        })
    });
    return boundFunc
};

/*
* 函数的 bind 方法核心是利用 call，同时考虑了一些其他情况，例如

bind 返回的函数被 new 调用作为构造函数时，绑定的值会失效并且改为 new 指定的对象
定义了绑定后函数的 length 属性和 name 属性（不可枚举属性）
绑定后函数的原型需指向原来的函数

* */

// 15. 实现函数 call 方法
const selfCall = function (context, ...args) {
    let func = this;
    context || (context = window);
    if (typeof func !== 'function') throw new Error('this is not function');
    let caller = Symbol('caller');
    context[caller] = func;
    let res = context[caller](...args);
    delete context[caller];
    return res;
};

/*原理就是将函数作为传入的上下文参数（context）的属性执行，这里为了防止属性冲突使用了 ES6 的 Symbol 类型*/

// 16. 简易的 CO 模块
function run(generatorFunc) {
    let it = generatorFunc();
    let result = it.next();
    return new Promise((resolve, reject) => {
        const next = function (result) {
            if (result.done) {
                resolve(result.value);
            }
            result.value = Promise.resolve(result.value);
            result.value.then(res => {
                let result = it.next(res);
                next(result);
            }).catch(err => {
                reject(err);
            })
        };
        next(result)
    })
}
// 使用方法
function* runFunc() {
    let res = yield api(data);
    console.log(res);
    let res2 = yield api(data2);
    console.log(res2);
    let res3 = yield api(data3);
    console.log(res3);
    console.log(res, res2, res3);
}

/*run 函数接受一个生成器函数，每当 run 函数包裹的生成器函数遇到 yield 关键字就会停止，当 yield 后面的 promise 被解析成功后会自动调用 next 方法执行到下个 yield 关键字处，最终就会形成每当一个 promise 被解析成功就会解析下个 promise，当全部解析成功后打印所有解析的结果，衍变为现在用的最多的 async/await 语法*/

// 17. 函数防抖
const debounce = (func, time = 17, options = { leading: true, trailing: true, context: null }) => {
    let timer;
    const _debounce = function (...args) {
        if (timer) {
            clearTimeout(timer)
        }
        if (options.leading && !timer) {
            timer = setTimeout(null, time);
            func.apply(options.context, args);
        } else if (options.trailing) {
            timer = setTimeout(() => {
                func.apply(options.context, args);
                timer = null
            }, time);
        }
    };
    _debounce.cancel = function () {
        clearTimeout(timer);
        timer = null;
    };
    return _debounce
};

/*leading 为是否在进入时立即执行一次， trailing 为是否在事件触发结束后额外再触发一次，原理是利用定时器，如果在规定时间内再次触发事件会将上次的定时器清除，即不会执行函数并重新设置一个新的定时器，直到超过规定时间自动触发定时器中的函数
同时通过闭包向外暴露了一个 cancel 函数，使得外部能直接清除内部的计数器*/

// 18. 函数节流
const throttle = (func, time = 17, options = { leading: true, trailing: false, context: null }) => {
    let previous = new Date(0).getTime();
    let timer;
    const _throttle = function (...args) {
        let now = new Date().getTime();
        if (!options.leading) {
            if (timer) return;
            timer = setTimeout(() => {
                timer = null;
                func.apply(options.context, args);
            }, time)
        } else if (now - previous > time) {
            func.apply(options.context, args);
            previous = now;
        } else if (options.trailing) {
            clearTimeout(timer);
            timer = setTimeout(() => {
                func.apply(options.context, args);
            }, time);
        }
    };
    _throttle.cancel = () => {
        previous = 0;
        clearTimeout(timer);
        timer = null;
    };
    return _throttle
};

/*和函数防抖类似，区别在于内部额外使用了时间戳作为判断，在一段时间内没有触发事件才允许下次事件触发*/

// 19. 图片懒加载
let imgList = [...document.querySelectorAll('img')];
let num = imgList.length;

let lazyLoad = (function () {
    let count = 0;
    return function () {
        let deleteIndexList = [];
        imgList.forEach((img, index) => {
            let rect = img.getBoundingClientRect();
            if (rect.top < window.innerHeight) {
                img.src = img.dataset.src;
                deleteIndexList.push(index);
                count++;
                if (count === num) {
                    document.removeEventListener('scroll', lazyLoad)
                }
            }
        });
        imgList = imgList.filter((_, index) => !deleteIndexList.includes(index));
    }
})();

/*getBoundClientRect 的实现方式，监听 scroll 事件（建议给监听事件添加节流），图片加载完会从 img 标签组成的 DOM 列表中删除，最后所有的图片加载完毕后需要解绑监听事件*/

let lazyLoad2 = function () {
    let observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.intersectionRatio > 0) {
                entry.target.src = entry.target.dataset.src;
                observer.unobserve(entry.target);
            }
        })
    });
    imgList.forEach(img => {
        observer.observe(img)
    })
};

/*intersectionObserver 的实现方式，实例化一个 IntersectionObserver ，并使其观察所有 img 标签
当 img 标签进入可视区域时会执行实例化时的回调，同时给回调传入一个 entries 参数，保存着实例观察的所有元素的一些状态，比如每个元素的边界信息，当前元素对应的 DOM 节点，当前元素进入可视区域的比率，每当一个元素进入可视区域，将真正的图片赋值给当前 img 标签，同时解除对其的观察
*/

// 20. new 关键字
const selfNew = function (fn, ...rest) {
    let instance = Object.assign(fn.prototype);
    let res = fn.apply(instance, rest);
    return isComplexDateType(res) ? res : instance
};

// 21. 实现 Object.assign
const selfAssign = function (target, ...source) {
    if (target == null) throw new Error('Cannot convert undefined or null to object');
    return source.reduce((acc, cur) => {
        isComplexDateType(acc) || (acc = new Object(acc));
        if (cur == null) return acc;
        [...Object.keys(cur), ...Object.getOwnPropertySymbols(cur)].forEach(key => {
            acc[key] = cur[key]
        });
        return acc
    }, target)
};

// 22. instanceof
const selfInstanceof = function (left, right) {
    let proto = Object.getPrototypeOf(left);
    while (true) {
        if (proto == null) return false;
        if (proto === right.prototype) {
            return true;
        }
        proto = Object.getPrototypeOf(proto)
    }
};

/*
* 原理是递归遍历 right 参数的原型链，每次和 left 参数作比较，遍历到原型链终点时则返回 false，找到则返回 true*/

// 23. 私有变量的实现
const proxy = function (obj) {
    return new Proxy(obj, {
        get (target, key) {
            if (key.startsWith('_')) {
                throw new Error('private key');
            }
            return Reflect.get(target, key);
        },
        ownKeys (target) {
            return Reflect.ownKeys(target).filter(key => !key.startsWith('_'));
        }
    })
};

// 使用 Proxy 代理所有含有 _ 开头的变量，使其不可被外部访问

const Person = (function () {
    const _name = Symbol('name');
    class Person {
        constructor (name) {
            this[_name] = name;
        }
        getName () {
            return this[_name]
        }
    }
    return Person
})();

// 通过闭包的形式保存私有变量，缺点在于类的所有实例访问的都是同一个私有变量

class Person {
    constructor (name) {
        let _name = name;
        this.getName = function () {
            return _name
        }
    }
}

// 另一种闭包的实现，解决了上面那种闭包的缺点，每个实例都有各自的私有变量，缺点是舍弃了 class 语法的简洁性，将所有的特权方法（访问私有变量的方法）都保存在构造函数中

const Person = (function () {
    let wp = new WeakMap();
    class Person {
        constructor (name) {
            wp.set(this, { name })
        }
        getName () {
            return wp.get(this).name
        }
    }
})();

// 通过 WeakMap 和闭包，在每次实例化时保存当前实例和所有私有变量组成的对象，外部无法访问闭包中的 WeakMap，使用 WeakMap 好处在于不需要担心内存溢出的问题

// 24. 洗牌算法
// 早前的 chrome 对于元素小于 10 的数组会采用插入排序，这会导致对数组进行的乱序并不是真正的乱序，即使最新的版本 chrome 采用了原地算法使得排序变成了一个稳定的算法，对于乱序的问题仍没有解决
//原理是将当前元素之后的所有元素中随机选取一个和当前元素互换
function shuffle(arr) {
    for (let i = 0; i < arr.length; i++) {
        let randomIndex = i + Math.floor(Math.random() * (arr.length - i));
        [arr[i], arr[randomIndex]] = [arr[randomIndex], arr[i]]
    }
    return arr;
}
// 通过洗牌算法可以达到真正的乱序，洗牌算法分为原地和非原地，图一是原地的洗牌算法，不需要声明额外的数组从而更加节约内存占用率，原理是依次遍历数组的元素，将当前元素和之后的所有元素中随机选取一个，进行交换

//新生成一个数组,随机从原数组中取出一个元素放入新数组
function shuffle2(arr) {
    let _arr = [];
    while (arr.length) {
        let randomIndex = Math.floor(Math.random() * (arr.length));
        _arr.push(arr.splice(randomIndex, 1)[0])
    }
    return _arr
}

// 25. 单例模式
function proxy (func) {
    let instance;
    let handler = {
        constructor (target, args) {
            if (!instance) {
                instance = Reflect.construct(func, args);
            }
            return instance
        }
    };
    return new Proxy(func, handler);
}

//通过 ES6 的 Proxy 拦截构造函数的执行方法来实现的单例模式

// 26. promisify
function promisify (asyncFunc) {
    return function (...args) {
        return new Promise((resolve, reject) => {
            args.push(function callback(err, ...values) {
                if (err) {
                    return reject(err);
                }
                return resolve(...values);
            });
            asyncFunc.call(this, ...args);
        })
    }
}

const fsp = new Proxy(fs, {
    get (target, key) {
        return promisify(target[key]);
    }
});

// 使用方法：
// await fsp.readFile('./promisify.js', 'utf-8')
// await fsp.writeFile('./promisify.js', data);

/*promisify 函数是将回调函数变为 promise 的辅助函数，适合 error-first 风格（nodejs）的回调函数，原理是给 error-first 风格的回调无论成功或者失败，在执行完毕后都会执行最后一个回调函数，我们需要做的就是让这个回调函数控制 promise 的状态即可
这里还用了 Proxy 代理了整个 fs 模块，拦截 get 方法，使得不需要手动给 fs 模块所有的方法都包裹一层 promisify 函数，更加的灵活*/
