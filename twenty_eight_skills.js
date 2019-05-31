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
