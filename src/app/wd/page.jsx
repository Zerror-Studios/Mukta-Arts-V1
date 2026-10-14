import HEROWD from '@/components/wd/HEROWD';
import ABOUTWD from '@/components/wd/ABOUTWD';
import React from 'react';
import { createPageMetadata } from '@/lib/seo';


const WDPage = () => {
    return (
        <>
            <HEROWD />
            <ABOUTWD />
        </>
    );
};

export default WDPage;

export async function generateMetadata(_props, parent) {
    return createPageMetadata('/wd', await parent);
}
