import { Box, CircularProgress, Fade } from '@mui/material';
import { add, format } from 'date-fns';

import CryptoJS from 'crypto-js';
import React from 'react';
import { faker } from '@faker-js/faker';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig() ?? {};
const { INVOICE_CLOUD_API_KEY } = publicRuntimeConfig ?? {};

const DATE_FORMAT_PATTERN = 'MM/dd/yyyy';

const OneTimePayment: React.FC = () => {
    const [src, setSrc] = React.useState<string>('');

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

        const raw1 = JSON.stringify({
            CreateCustomerRecord: 'false', //can use true to create the account
            ViewMode: 1,
            CSSUrl: 'https://www.invoicecloud.com/ssotest/sso-gmp.css',
            Customers: [
                {
                    AccountNumber: 'FBIQ6138308-00-0000',
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
                        // {
                        //     InvoiceNumber: faker.finance.bic(),
                        //     TypeID: 164,
                        //     DueDate: '09/02/2022',
                        //     InvoiceDate: '08/09/2022',
                        //     BalanceDue: 87.9,
                        //     CCServiceFee: 1.53,
                        //     AchServiceFee: 2.41
                        // }
                    ]
                }
            ],
            AllowSwipe: false,
            AllowCCPayment: true,
            AllowACHPayment: false,
            UserType: '2', //dependent on who is processing the payment
            UserLogName: 'CSR', //dependent on who is processing the payment
            // "UserLogName": "Test Account",
            RequireAuthorization: false,
            RequireEmail: false,
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

        // const raw2 = JSON.stringify({
        //     CreateCustomerRecord: 'false',
        //     // AgentConnectViewMode: 1,
        //     ViewMode: 1,
        //     CSSUrl: 'https://www.invoicecloud.com/ssotest/sso-gmp.css',
        //     Customers: [
        //         {
        //             AccountNumber: 'Account123',
        //             Invoices: [
        //                 {
        //                     InvoiceNumber: 'Invoice123-123',
        //                     TypeID: 164,
        //                     DueDate: '11/04/2022',
        //                     InvoiceDate: '10/05/2022',
        //                     BalanceDue: 9.71,
        //                     CCServiceFee: 1.0,
        //                     AchServiceFee: 2.0
        //                 }
        //             ]
        //         }
        //     ],
        //     AllowSwipe: true,
        //     AllowCCPayment: true,
        //     AllowACHPayment: true,
        //     UserType: '2',
        //     UserLogName: 'CSR',
        //     RequireAuthorization: false,
        //     RequireEmail: false,
        //     BillerReference: '913109767A-07242022-2022'
        // });

        const requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw1,
            // body: raw2,
            redirect: 'follow'
        };

        fetch(
            'https://www.invoicecloud.com/agentconnectapi/OneTimePayment/GenerateOneTimePaymentUrl',
            // @ts-ignore
            requestOptions
        )
            .then(response => response.json())
            .then(data => {
                console.log(data);
                const {
                    Data: { AgentConnectUrl }
                } = data ?? {};

                if (AgentConnectUrl) {
                    return setSrc(AgentConnectUrl);
                }

                throw new Error('AgentConnectUrl not found', data);
            })
            .catch(error => console.log('error', error));
    }, [setSrc]);

    return (
        <>
            {src && (
                <iframe
                    src={src}
                    width="100%"
                    height="1000"
                    id="PaymentFrame"
                    title="Payment Frame"
                    style={{ border: 'none' }}
                />
            )}
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                }}
            >
                <Box sx={{ height: 40 }}>
                    <Fade
                        in={!src}
                        style={{
                            transitionDelay: !src ? '800ms' : '0ms'
                        }}
                        unmountOnExit
                    >
                        <CircularProgress />
                    </Fade>
                </Box>
            </Box>
        </>
    );
};

export default OneTimePayment;
