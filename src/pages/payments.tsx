import Layout from '@/components/layout';
import Payments from '@/components/payments';
import React from 'react';

const IndexPage: React.FC = () => {
    return (
        <Layout title="Payments">
            <Payments />
        </Layout>
    );
};

export default IndexPage;
