import HEROWD from '@/components/wd/HEROWD';
import ABOUTWD from '@/components/wd/ABOUTWD';
import React from 'react';
import { noindexMetadata } from '@/lib/seo/metadata';


const WDPage = () => {
    return (
        <>
            <HEROWD />
            <ABOUTWD />
        </>
    );
};

export default WDPage;

export const metadata = noindexMetadata('Whistling Woods International');
