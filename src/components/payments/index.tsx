import { Box, CircularProgress, Fade } from '@mui/material';
import { add, format } from 'date-fns';

import CryptoJS from 'crypto-js';
import React from 'react';
import { faker } from '@faker-js/faker';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig() ?? {};
const { INVOICE_CLOUD_API_KEY } = publicRuntimeConfig ?? {};

const DATE_FORMAT_PATTERN = 'MM/dd/yyyy';

const Payments: React.FC = () => {
    // const [src, setSrc] = React.useState<string>(
    //     'https://www.invoicecloud.com/portal/access/otp/Qkc9NmJiNjc2MjMtOTk1Mi00OTMyLTk2ZDctM2ZkM2U2ODNmMTBifEFDUkc9ZDFiMTYwMWEtMWVmYi00OGY0LTllYzktOTM3MzQyYTYyMjQxfFNDT1RQPTE-'
    // );

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

        const raw = JSON.stringify({
            // PostbackURL: 'http://local.invoicecloud.com:3137/postback',
            PostbackURL: 'http://localhost:3137/postback',
            CreateCustomerRecord: true,
            // ReturnURL: 'http://local.invoicecloud.com:3137/success',     // this doesn't work w/ an iframe
            ReturnURL: 'https://www.google.com',
            ViewMode: 1,
            CssUrl: 'https://www.invoicecloud.com/ssotest/sso-gmp.css', // should be self-hosted.
            // CssUrl: 'https://www.google.com',
            AllowCCPayment: true,
            AllowACHPayment: false,
            Customers: [
                {
                    // AccountNumber: faker.finance.account(10),
                    AccountNumber: 'FBIQ1941793-00-0000',
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
                            BalanceDue: faker.finance.amount(50, 1000),
                            CCServiceFee: 0.0,
                            AchServiceFee: 0.0
                        }
                        // {
                        //     InvoiceNumber: faker.finance.bic(),
                        //     TypeID: 165,
                        //     DueDate,
                        //     InvoiceDate,
                        //     BalanceDue: faker.finance.amount(50, 1000),
                        //     CCServiceFee: 0.0,
                        //     AchServiceFee: 0.0
                        // }
                    ]
                }
            ],
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
            body: raw,
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

                throw new Error('CloudPaymentURL not found', data);
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

export default Payments;
