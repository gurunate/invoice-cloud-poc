import { Box, CircularProgress, Fade, Typography } from '@mui/material';
import { add, format } from 'date-fns';

import CryptoJS from 'crypto-js';
import Layout from '@/components/layout';
import Link from 'next/link';
import React from 'react';
import { faker } from '@faker-js/faker';
import getConfig from 'next/config';
import { useRouter } from 'next/router';

const { publicRuntimeConfig } = getConfig() ?? {};
const { INVOICE_CLOUD_API_KEY } = publicRuntimeConfig ?? {};

const DATE_FORMAT_PATTERN = 'MM/dd/yyyy';

const DefaultWindowViewMode: React.FC = () => {
    const [src, setSrc] = React.useState<string>('');
    const router = useRouter();

    React.useEffect(() => {
        const now = new Date();
        const DueDate = format(add(now, { days: 30 }), DATE_FORMAT_PATTERN);
        const InvoiceDate = format(now, DATE_FORMAT_PATTERN);

        const token = CryptoJS.enc.Base64.stringify(
            CryptoJS.enc.Utf8.parse(INVOICE_CLOUD_API_KEY)
        );

        const myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        myHeaders.append('Authorization', `Basic ${token}`);

        const firstName = faker.name.firstName();
        const lastName = faker.name.lastName();

        const BalanceDue = 75.18;
        // const CCServiceFee = BalanceDue * 0.03;
        const CCServiceFee = 0;

        const body = JSON.stringify({
            CreateCustomerRecord: false, //can use true to create the account
            ViewMode: 0,
            CSSUrl: 'https://www.invoicecloud.com/ssotest/sso-gmp.css',
            ReturnURL: 'http://local.policyport.io:3137/success',
            PostBackURL: 'http://localhost:3137/api/postback',
            Customers: [
                {
                    AccountNumber: 'FBIQ6138308-00-0000',
                    Name: `${firstName} ${lastName}`,
                    Address: faker.address.streetAddress(),
                    City: faker.address.city(),
                    State: faker.address.stateAbbr(),
                    Zip: faker.address.zipCode(),
                    EmailAddress: faker.internet.email(firstName, lastName),
                    Invoices: [
                        {
                            InvoiceNumber: faker.finance.bic(),
                            TypeID: 164,
                            DueDate,
                            InvoiceDate,
                            BalanceDue,
                            CCServiceFee,
                            AchServiceFee: 0
                        }
                    ]
                }
            ],
            AllowSwipe: false,
            AllowCCPayment: true,
            AllowACHPayment: false,
            BillerReference: '913109767A-07242022-2022',
            PageResultOptions: {
                AllowRegisterAccount: false,
                InvoiceOptions: {
                    AllowViewStatement: false,
                    AllowRemove: false,
                    AllowViewRelated: false,
                    AllowRemindMe: false
                }
            }
        });

        const requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body,
            redirect: 'follow'
        };

        fetch(
            'https://www.invoicecloud.com/cloudpaymentsapi/v2',
            // @ts-ignore
            requestOptions
        )
            .then(response => response.json())
            .then(data => {
                console.log(data);
                const {
                    Data: { CloudPaymentURL }
                } = data ?? {};

                if (CloudPaymentURL) {
                    return setSrc(CloudPaymentURL);
                }

                throw new Error('AgentConnectUrl not found', data);
            })
            .catch(error => console.log('error', error));
    }, [setSrc]);

    if (src) {
        router.push(src);
    }

    return (
        <Layout>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <Box sx={{ height: '90vh' }}>
                    <CircularProgress />
                    <Typography>Doing something...</Typography>
                </Box>
            </Box>
        </Layout>
    );
};

export default DefaultWindowViewMode;
