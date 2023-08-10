import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import {
    AppBar,
    Box,
    Button,
    Container,
    IconButton,
    Toolbar,
    Typography
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

export type LayoutProps = {
    title?: string;
    children: React.ReactNode;
};

const SITE_TITLE = 'InvoiceCloud POC';

/**
 * Layout component.
 *
 * @param {LayoutProps} props
 * @returns {React.ReactElement}
 */
const Layout: React.FC<LayoutProps> = ({
    title,
    children
}: LayoutProps): React.ReactElement => {
    return (
        <>
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static">
                    <Toolbar>
                        <Link href="/">
                            <IconButton
                                size="large"
                                edge="start"
                                color="inherit"
                                aria-label="menu"
                                sx={{ mr: 2 }}
                            >
                                <MenuIcon />
                            </IconButton>
                        </Link>
                        <Typography
                            variant="h6"
                            component="div"
                            sx={{ flexGrow: 1 }}
                        >
                            {SITE_TITLE}: {title}
                        </Typography>
                        <Button color="inherit">Login</Button>
                    </Toolbar>
                </AppBar>
            </Box>
            <Container maxWidth="xl">
                <Head>
                    <title>
                        {title}
                        {title && ' - '}
                        {SITE_TITLE}
                    </title>
                </Head>
                <Box mt={4}>
                    <main>{children}</main>
                </Box>
                <footer>
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        align="center"
                    >
                        {'© '}
                        {new Date().getFullYear()}
                        {'.'} All rights reserved.
                    </Typography>
                </footer>
            </Container>
        </>
    );
};

export default Layout;
