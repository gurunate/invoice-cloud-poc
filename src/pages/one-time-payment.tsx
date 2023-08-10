import Layout from '@/components/layout';
import OneTimePayment from '@/components/one-time-payment';
import React from 'react';

const IndexPage: React.FC = () => {
    return (
        <Layout title="One Time Payment">
            <OneTimePayment />
        </Layout>
    );
};

export default IndexPage;
