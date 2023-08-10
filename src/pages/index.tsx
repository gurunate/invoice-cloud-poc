import Layout from '@/components/layout';
import Link from 'next/link';
import React from 'react';
import { Stack } from '@mui/material';

const IndexPage: React.FC = () => {
    return (
        <Layout title="Home">
            <Stack direction="row" spacing={4}>
                <Link href="/payments">Make a payment</Link>
                <Link href="/one-time-payment">Make a one time payment</Link>
                <Link href="/default-window">Default window payment</Link>
            </Stack>
        </Layout>
    );
};

export default IndexPage;
