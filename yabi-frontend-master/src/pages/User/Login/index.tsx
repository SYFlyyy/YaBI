import { Footer } from '@/components';
import {
  LockOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  LoginForm,
  ProFormInstance,
  ProFormText,
} from '@ant-design/pro-components';
import { message, Tabs} from 'antd';
import { createStyles } from 'antd-style';
import React, {useRef, useState} from 'react';
import {useModel} from '@umijs/max';
import {userLoginUsingPost, userRegisterUsingPost} from "@/services/yabi/userController";
type LoginType = 'account' | 'register' | 'forgetPassword';
const useStyles = createStyles(({ token }): any => {
  return {
    action: {
      marginLeft: '8px',
      color: 'rgba(0, 0, 0, 0.2)',
      fontSize: '24px',
      verticalAlign: 'middle',
      cursor: 'pointer',
      transition: 'color 0.3s',
      '&:hover': {
        color: token.colorPrimaryActive,
      },
    },
    lang: {
      width: 42,
      height: 42,
      lineHeight: '42px',
      position: 'fixed',
      right: 16,
      borderRadius: token.borderRadius,
      ':hover': {
        backgroundColor: token.colorBgTextHover,
      },
    },
    container: {
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      overflow: 'auto',
      backgroundImage:
        "url('https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/V-_oS6r-i7wAAAAAAAAAAAAAFl94AQBr')",
      backgroundSize: '100% 100%',
    },
  };
});
const Login: React.FC = () => {
  const [loginType, setLoginType] = useState<LoginType>('account');
  const {setInitialState } = useModel('@@initialState');
  const { styles } = useStyles();
  const formRef = useRef<ProFormInstance>();
  const handleSubmit = async (values: API.UserRegisterRequest) => {
    const {userPassword, checkPassword} = values;
    if (checkPassword) {
      try {
        // 注册
        if (userPassword !== checkPassword) {
          message.error('两次输入密码不一致！');
          return;
        }
        const res = await userRegisterUsingPost(values);
        if (res.code === 0) {
          // 注册成功
          const defaultRegisterSuccessMessage = '注册成功！';
          message.success(defaultRegisterSuccessMessage)
          // 切换到登录
          setLoginType('account');
          // 重置表单
          formRef.current?.resetFields();
        }
      } catch (error) {
        const defaultLoginFailureMessage = '注册失败，请重试！';
        console.log(error);
        message.error(defaultLoginFailureMessage);
      }
    } else {
      try {
        // 登录
        const res = await userLoginUsingPost({
          ...values,
        } as API.UserLoginRequest);
        if (res.data) {
          const defaultLoginSuccessMessage = '登录成功！';
          message.success(defaultLoginSuccessMessage);
          // 登录成功后处理
          const urlParams = new URL(window.location.href).searchParams;
          // 重定向到 redirect 参数所在的位置
          location.href = urlParams.get('redirect') || '/';
          // 保存登录状态
          setInitialState({
            loginUser: res.data,
          });
        }
      } catch (error) {
        const defaultLoginFailureMessage = '登录失败，请重试！';
        console.log(error);
        message.error(defaultLoginFailureMessage);
      }
    }
  };
  return (
    <div className={styles.container}>
      <div
        style={{
          flex: '1',
          padding: '32px 0',
        }}
      >
        <LoginForm
          contentStyle={{
            minWidth: 280,
            maxWidth: '75vw',
          }}
          logo={<img alt="logo" src="/logo.svg" />}
          title="鸭智能 BI"
          subTitle={'烧鸭饭的项目'}
          initialValues={{
            autoLogin: true,
          }}
          onFinish={async (values) => {
            await handleSubmit(values as API.UserLoginRequest);
          }}
        >
          <Tabs
            centered
            activeKey={loginType}
            onChange={(activeKey) => setLoginType(activeKey as LoginType)}
          >
            <Tabs.TabPane key={'account'} tab={'登录'}/>
            <Tabs.TabPane key={'register'} tab={'注册'}/>
          </Tabs>
          {loginType === 'account' && (
            <>
              <ProFormText
                name="userAccount"
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined/>,
                }}
                placeholder={'请输入用户名'}
                rules={[
                  {
                    required: true,
                    message: '用户名是必填项！',
                  },
                ]}
              />
              <ProFormText.Password
                name="userPassword"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined/>,
                }}
                placeholder={'请输入密码'}
                rules={[
                  {
                    required: true,
                    message: '密码是必填项！',
                  },
                ]}
              />
            </>
          )}

          {loginType === 'register' && (
            <>
              <ProFormText
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined/>,
                }}
                name="userAccount"
                placeholder={'请输入用户名'}
                rules={[
                  {
                    required: true,
                    message: '用户名是必填项！',
                  },
                  {
                    min: 4,
                    message: '长度不能少于4位！',
                  },
                ]}
              />
              <ProFormText.Password
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined/>,
                }}
                name="userPassword"
                placeholder={'请输入密码'}
                rules={[
                  {
                    required: true,
                    message: '密码是必填项！',
                  },
                  {
                    min: 8,
                    message: '长度不能少于8位！',
                  },
                ]}
              />
              <ProFormText.Password
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined/>,
                }}
                name="checkPassword"
                placeholder={'请再次输入密码'}
                rules={[
                  {
                    required: true,
                    message: '密码是必填项！',
                  },
                  {
                    min: 8,
                    message: '长度不能少于8位！',
                  },
                ]}
              />
            </>
          )}
        </LoginForm>
      </div>
      <Footer />
    </div>
  );
};
export default Login;
