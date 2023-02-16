import { PageLayout } from '@/lib/components/page';
import { isConnected, useWeb3 } from '@/lib/state/useWeb3';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function Dashboard() {
    const web3 = useWeb3();
    const router = useRouter();

    useEffect(() => {
        if (!isConnected(web3)) router.push('/login');
    }, []);
    
    return <PageLayout>Dashh</PageLayout>;
}
