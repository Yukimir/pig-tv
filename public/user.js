function formDataToJson(formData) {
    let obj = {};
    formData.forEach((value, key) => {
        obj[key] = value;
    })
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
    }).then((response) => {
        return response.text();
    }).then((body) => {
        return JSON.parse(body);
    })
}
async function getUserInfo() {
    const token = localStorage.getItem('token');
    if (!token) return null;
    const body = await emitFetch('/user/info', 'POST', { token: token });
    if (body.status === 200) {
        return body.message;
    } else {
        localStorage.removeItem('token');
        return null;
    }
}

class modifyComponent {
    constructor(element) {
        this.element = element;
    }
    remove() {
        this.element.innerHTML = '';
    }
    async create() {
        // 去获取信息
        const user = await getUserInfo();
        if (!user) {
            this.remove();
            (new loginComponent(this.element)).create();
            return;
        }
        this.element.innerHTML = `
            <div class="modify container">
                <p id="modify-error"></p>
                <form id="modify-form">
                    <p>
                        修改密码
                    </p>
                    <input type="password" name="oldPassword" placeholder="原密码" />
                    <input type="text" name="password" placeholder="密码" />
                    <p>修改昵称</p>
                    <input type="text" name="nickname" placeholder="昵称" value="${user.nickname}" />
                    <input type="submit" value="提交" />
                </form>
                <button id="modify-back">返回</button>
            </div>
        `;
        const regForm = document.getElementById('modify-form');
        regForm.onsubmit = async (e) => {
            e.preventDefault();

            const f = e.target
            const formData = formDataToJson(new FormData(f));
            const emitData = {
                token: localStorage.getItem('token'),
                update: formData
            }
            const body = await emitFetch('/user/modify', 'PUT', emitData);
            if (body.status === 200) {
                const token = body.message;
                localStorage.setItem('token', token);
                this.remove();
                (new infoComponent(this.element)).create();
            } else {
                document.getElementById('modify-error').innerHTML = body.message;
            }
        }
        document.getElementById('modify-back').onclick = (e) => {
            this.remove();
            (new infoComponent(this.element)).create();
        }
    }
}

class regComponent {
    constructor(element) {
        this.element = element;
    }
    remove() {
        this.element.innerHTML = '';
    }
    create() {
        this.element.innerHTML = `
            <div class="reg container">
                <p id="reg-error"></p>
                <form id="reg-form">
                    <input type="text" name="username" placeholder="用户名" />
                    <input type="password" name="password" placeholder="密码" />
                    <input type="mail" name="mail" placeholder="邮箱" />
                    <input type="text" name="nickname" placeholder="昵称" />
                    <input type="submit" value="注册"/>
                </form>
                <button id="reg-back">返回</button>
            </div>
        `;
        const regForm = document.getElementById('reg-form');
        regForm.onsubmit = async (e) => {
            e.preventDefault();

            const f = e.target
            const formData = formDataToJson(new FormData(f));
            const body = await emitFetch('/users/reg', 'POST', formData);
            if (body.status === 200) {
                const token = body.message;
                localStorage.setItem('token', token);
                this.remove();
                (new infoComponent(this.element)).create();
            } else {
                document.getElementById('reg-error').innerHTML = body.message;
            }
        }
        document.getElementById('reg-back').onclick = (e) => {
            this.remove();
            (new loginComponent(this.element)).create();
        }
    }
}

class infoComponent {
    constructor(element) {
        this.element = element;
    }
    remove() {
        this.element.innerHTML = '';
    }
    async create() {
        const info = await getUserInfo();
        if (!info) {
            this.remove();
            (new loginComponent(this.element)).create();
            return;
        }
        this.element.innerHTML = `
            <div class="info container">
            <p>
                欢迎回来，指挥官${info.nickname}
            </p>
            <p>
                您的房间密钥为：${info.sign}
            </p>
            <button id="modify-info-btn">修改信息</button>
            <button class="btn-red" id="logout-btn">退出登录</button>
            </div>
        `;
        document.getElementById('logout-btn').onclick = (e) => {
            localStorage.removeItem('token');
            this.remove();
            const login = new loginComponent(this.element);
            login.create();
        }
        document.getElementById('modify-info-btn').onclick = (e) => {
            this.remove();
            (new modifyComponent(this.element)).create();
        }
    }
}

class loginComponent {
    constructor(element) {
        this.element = element;
    }
    remove() {
        this.element.innerHTML = '';

    }
    create() {
        this.element.innerHTML = `
            <div class="login container">
                <p id="login_error"></p>
                <form id="login_form">
                    <input name="username" type="text" value="" placeholder="用户名" />
                    <input name="password" type="password" value="" placeholder="密码" />
                    <input class="btn-brand" type="submit" value="登入"/>
                </form>
                <button class="btn-green" id="reg-btn">注册</button>
            </div>`
            ;
        const regBtn = document.getElementById('reg-btn');
        regBtn.onclick = () => {
            this.remove();
            (new regComponent(this.element)).create();
        }
        const login_form = document.getElementById('login_form');
        login_form.onsubmit = async (e) => {
            e.preventDefault();

            const f = e.target
            const formData = formDataToJson(new FormData(f));
            const body = await emitFetch('/users/login', 'POST', formData);
            if (body.status === 200) {
                const token = body.message;
                localStorage.setItem('token', token);
                this.remove();
                (new infoComponent(this.element)).create();
            } else {
                document.getElementById('login_error').innerHTML = body.message;
            }
        }
    }
}

async function init() {
    const user = await getUserInfo();
    if (user) {
        (new infoComponent(document.getElementById('user-panel'))).create(user);
    } else {
        (new loginComponent(document.getElementById('user-panel'))).create();
    }
}

init();

function showUserPanel() {
    document.getElementById('user-container').classList.remove('hidden');
}
function hideUserPanel() {
    document.getElementById('user-container').classList.add('hidden');
}