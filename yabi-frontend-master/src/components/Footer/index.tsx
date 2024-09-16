import { GithubOutlined } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-components';
import React from 'react';

const Footer: React.FC = () => {
  const defaultMessage = '烧鸭饭出品';
  const currentYear = new Date().getFullYear();
  return (
    <DefaultFooter
      copyright={`${currentYear} ${defaultMessage}`}
      style={{
        background: 'none',
      }}
      links={[
        {
          key: 'github',
          title: <><GithubOutlined /> 烧鸭饭 GitHub</>,
          href: 'https://github.com/SYFlyyy',
          blankTarget: true,
        },
      ]}
    />
  );
};

export default Footer;
