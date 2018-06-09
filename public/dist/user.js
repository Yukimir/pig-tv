'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var getUserInfo = function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var token, body;
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        token = localStorage.getItem('token');

                        if (token) {
                            _context.next = 3;
                            break;
                        }

                        return _context.abrupt('return', null);

                    case 3:
                        _context.next = 5;
                        return emitFetch('/user/info', 'POST', { token: token });

                    case 5:
                        body = _context.sent;

                        if (!(body.status === 200)) {
                            _context.next = 10;
                            break;
                        }

                        return _context.abrupt('return', body.message);

                    case 10:
                        localStorage.removeItem('token');
                        return _context.abrupt('return', null);

                    case 12:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, this);
    }));

    return function getUserInfo() {
        return _ref.apply(this, arguments);
    };
}();

var init = function () {
    var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7() {
        var user;
        return regeneratorRuntime.wrap(function _callee7$(_context7) {
            while (1) {
                switch (_context7.prev = _context7.next) {
                    case 0:
                        _context7.next = 2;
                        return getUserInfo();

                    case 2:
                        user = _context7.sent;

                        if (user) {
                            new infoComponent(document.getElementById('user-panel')).create(user);
                        } else {
                            new loginComponent(document.getElementById('user-panel')).create();
                        }

                    case 4:
                    case 'end':
                        return _context7.stop();
                }
            }
        }, _callee7, this);
    }));

    return function init() {
        return _ref7.apply(this, arguments);
    };
}();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function formDataToJson(formData) {
    var obj = {};
    formData.forEach(function (value, key) {
        obj[key] = value;
    });
    return obj;
}

function emitFetch(url, method, obj) {
    return fetch(url, {
        method: method,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(obj)
    }).then(function (response) {
        return response.text();
    }).then(function (body) {
        return JSON.parse(body);
    });
}

var modifyComponent = function () {
    function modifyComponent(element) {
        _classCallCheck(this, modifyComponent);

        this.element = element;
    }

    _createClass(modifyComponent, [{
        key: 'remove',
        value: function remove() {
            this.element.innerHTML = '';
        }
    }, {
        key: 'create',
        value: function () {
            var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
                var _this = this;

                var user, regForm;
                return regeneratorRuntime.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                _context3.next = 2;
                                return getUserInfo();

                            case 2:
                                user = _context3.sent;

                                if (user) {
                                    _context3.next = 7;
                                    break;
                                }

                                this.remove();
                                new loginComponent(this.element).create();
                                return _context3.abrupt('return');

                            case 7:
                                this.element.innerHTML = '\n            <div class="modify container">\n                <p id="modify-error"></p>\n                <form id="modify-form">\n                    <p>\n                        \u4FEE\u6539\u5BC6\u7801\n                    </p>\n                    <input type="password" name="oldPassword" placeholder="\u539F\u5BC6\u7801" />\n                    <input type="text" name="password" placeholder="\u5BC6\u7801" />\n                    <p>\u4FEE\u6539\u6635\u79F0</p>\n                    <input type="text" name="nickname" placeholder="\u6635\u79F0" value="' + user.nickname + '" />\n                    <input type="submit" value="\u63D0\u4EA4" />\n                </form>\n                <button id="modify-back">\u8FD4\u56DE</button>\n            </div>\n        ';
                                regForm = document.getElementById('modify-form');

                                regForm.onsubmit = function () {
                                    var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(e) {
                                        var f, formData, emitData, body, token;
                                        return regeneratorRuntime.wrap(function _callee2$(_context2) {
                                            while (1) {
                                                switch (_context2.prev = _context2.next) {
                                                    case 0:
                                                        e.preventDefault();

                                                        f = e.target;
                                                        formData = formDataToJson(new FormData(f));
                                                        emitData = {
                                                            token: localStorage.getItem('token'),
                                                            update: formData
                                                        };
                                                        _context2.next = 6;
                                                        return emitFetch('/user/modify', 'PUT', emitData);

                                                    case 6:
                                                        body = _context2.sent;

                                                        if (body.status === 200) {
                                                            token = body.message;

                                                            localStorage.setItem('token', token);
                                                            _this.remove();
                                                            new infoComponent(_this.element).create();
                                                        } else {
                                                            document.getElementById('modify-error').innerHTML = body.message;
                                                        }

                                                    case 8:
                                                    case 'end':
                                                        return _context2.stop();
                                                }
                                            }
                                        }, _callee2, _this);
                                    }));

                                    return function (_x) {
                                        return _ref3.apply(this, arguments);
                                    };
                                }();
                                document.getElementById('modify-back').onclick = function (e) {
                                    _this.remove();
                                    new infoComponent(_this.element).create();
                                };

                            case 11:
                            case 'end':
                                return _context3.stop();
                        }
                    }
                }, _callee3, this);
            }));

            function create() {
                return _ref2.apply(this, arguments);
            }

            return create;
        }()
    }]);

    return modifyComponent;
}();

var regComponent = function () {
    function regComponent(element) {
        _classCallCheck(this, regComponent);

        this.element = element;
    }

    _createClass(regComponent, [{
        key: 'remove',
        value: function remove() {
            this.element.innerHTML = '';
        }
    }, {
        key: 'create',
        value: function create() {
            var _this2 = this;

            this.element.innerHTML = '\n            <div class="reg container">\n                <p id="reg-error"></p>\n                <form id="reg-form">\n                    <input type="text" name="username" placeholder="\u7528\u6237\u540D" />\n                    <input type="password" name="password" placeholder="\u5BC6\u7801" />\n                    <input type="mail" name="mail" placeholder="\u90AE\u7BB1" />\n                    <input type="text" name="nickname" placeholder="\u6635\u79F0" />\n                    <input type="submit" value="\u6CE8\u518C"/>\n                </form>\n                <button id="reg-back">\u8FD4\u56DE</button>\n            </div>\n        ';
            var regForm = document.getElementById('reg-form');
            regForm.onsubmit = function () {
                var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(e) {
                    var f, formData, body, token;
                    return regeneratorRuntime.wrap(function _callee4$(_context4) {
                        while (1) {
                            switch (_context4.prev = _context4.next) {
                                case 0:
                                    e.preventDefault();

                                    f = e.target;
                                    formData = formDataToJson(new FormData(f));
                                    _context4.next = 5;
                                    return emitFetch('/users/reg', 'POST', formData);

                                case 5:
                                    body = _context4.sent;

                                    if (body.status === 200) {
                                        token = body.message;

                                        localStorage.setItem('token', token);
                                        _this2.remove();
                                        new infoComponent(_this2.element).create();
                                    } else {
                                        document.getElementById('reg-error').innerHTML = body.message;
                                    }

                                case 7:
                                case 'end':
                                    return _context4.stop();
                            }
                        }
                    }, _callee4, _this2);
                }));

                return function (_x2) {
                    return _ref4.apply(this, arguments);
                };
            }();
            document.getElementById('reg-back').onclick = function (e) {
                _this2.remove();
                new loginComponent(_this2.element).create();
            };
        }
    }]);

    return regComponent;
}();

var infoComponent = function () {
    function infoComponent(element) {
        _classCallCheck(this, infoComponent);

        this.element = element;
    }

    _createClass(infoComponent, [{
        key: 'remove',
        value: function remove() {
            this.element.innerHTML = '';
        }
    }, {
        key: 'create',
        value: function () {
            var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
                var _this3 = this;

                var info;
                return regeneratorRuntime.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                _context5.next = 2;
                                return getUserInfo();

                            case 2:
                                info = _context5.sent;

                                if (info) {
                                    _context5.next = 7;
                                    break;
                                }

                                this.remove();
                                new loginComponent(this.element).create();
                                return _context5.abrupt('return');

                            case 7:
                                this.element.innerHTML = '\n            <div class="info container">\n            <p>\n                \u6B22\u8FCE\u56DE\u6765\uFF0C\u6307\u6325\u5B98' + info.nickname + '\n            </p>\n            <p>\n                \u60A8\u7684\u623F\u95F4\u5BC6\u94A5\u4E3A\uFF1A' + info.sign + '\n            </p>\n            <button id="modify-info-btn">\u4FEE\u6539\u4FE1\u606F</button>\n            <button class="btn-red" id="logout-btn">\u9000\u51FA\u767B\u5F55</button>\n            </div>\n        ';
                                document.getElementById('logout-btn').onclick = function (e) {
                                    localStorage.removeItem('token');
                                    _this3.remove();
                                    var login = new loginComponent(_this3.element);
                                    login.create();
                                };
                                document.getElementById('modify-info-btn').onclick = function (e) {
                                    _this3.remove();
                                    new modifyComponent(_this3.element).create();
                                };

                            case 10:
                            case 'end':
                                return _context5.stop();
                        }
                    }
                }, _callee5, this);
            }));

            function create() {
                return _ref5.apply(this, arguments);
            }

            return create;
        }()
    }]);

    return infoComponent;
}();

var loginComponent = function () {
    function loginComponent(element) {
        _classCallCheck(this, loginComponent);

        this.element = element;
    }

    _createClass(loginComponent, [{
        key: 'remove',
        value: function remove() {
            this.element.innerHTML = '';
        }
    }, {
        key: 'create',
        value: function create() {
            var _this4 = this;

            this.element.innerHTML = '\n            <div class="login container">\n                <p id="login_error"></p>\n                <form id="login_form">\n                    <input name="username" type="text" value="" placeholder="\u7528\u6237\u540D" />\n                    <input name="password" type="password" value="" placeholder="\u5BC6\u7801" />\n                    <input class="btn-brand" type="submit" value="\u767B\u5165"/>\n                </form>\n                <button class="btn-green" id="reg-btn">\u6CE8\u518C</button>\n            </div>';
            var regBtn = document.getElementById('reg-btn');
            regBtn.onclick = function () {
                _this4.remove();
                new regComponent(_this4.element).create();
            };
            var login_form = document.getElementById('login_form');
            login_form.onsubmit = function () {
                var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(e) {
                    var f, formData, body, token;
                    return regeneratorRuntime.wrap(function _callee6$(_context6) {
                        while (1) {
                            switch (_context6.prev = _context6.next) {
                                case 0:
                                    e.preventDefault();

                                    f = e.target;
                                    formData = formDataToJson(new FormData(f));
                                    _context6.next = 5;
                                    return emitFetch('/users/login', 'POST', formData);

                                case 5:
                                    body = _context6.sent;

                                    if (body.status === 200) {
                                        token = body.message;

                                        localStorage.setItem('token', token);
                                        _this4.remove();
                                        new infoComponent(_this4.element).create();
                                    } else {
                                        document.getElementById('login_error').innerHTML = body.message;
                                    }

                                case 7:
                                case 'end':
                                    return _context6.stop();
                            }
                        }
                    }, _callee6, _this4);
                }));

                return function (_x3) {
                    return _ref6.apply(this, arguments);
                };
            }();
        }
    }]);

    return loginComponent;
}();

init();

function showUserPanel() {
    document.getElementById('user-container').classList.remove('none');
}
function hideUserPanel() {
    document.getElementById('user-container').classList.add('none');
}