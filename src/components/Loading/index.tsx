import React, { FC } from 'react';
import styles from './index.less';

const Loading: FC = (props: any) => {
  const { show } = props;
  return (
    <div className={styles.loading} style={{ display: show ? 'block' : 'none' }}>
      <div className={styles.text}>加载中...</div>
    </div>
  );
}

export default Loading;
