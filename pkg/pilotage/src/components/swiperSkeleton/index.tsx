import { Col, Row, Skeleton } from 'antd';
import styles from './index.module.scss';

export default function SwiperSkeleton() {
    return (
        <Row gutter={24}>
            {Array(6)
                .fill(1)
                .map((_, i) => (
                    <Col sm={8} md={6} xl={4} key={i}>
                        <Skeleton active>
                            <div id="itemCard" className={styles.itemCard}>
                                <div id="itemCardContent" className={styles.itemCardContent}>
                                    <Skeleton.Avatar active size={36} />
                                    <p>dakjbs</p>
                                </div>
                            </div>
                        </Skeleton>
                    </Col>
                ))}
        </Row>
    );
}
