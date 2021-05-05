import { useSession, signIn } from 'next-auth/client';
import { useRouter } from 'next/router';
import { Session } from 'next-auth/index';

import { api } from '../../services/api';
import { getStripeJs } from '../../services/stripe-js';

import styles from './styles.module.scss';

interface SessionProps extends Session {
  activeSubscription?: null | object;
}
interface SubscribeButtonProps {
  priceId: string;
}

export function SubscribeButton({ priceId }: SubscribeButtonProps) {
  const [session] = useSession();
  const router = useRouter();

  const sessionAux: SessionProps = session;

  async function handleSubscribe() {
    if (!session) {
      signIn('github');
      return;
    }

    if (sessionAux?.activeSubscription) {
      router.push('/posts');
      return;
    }

    try {
      const response = await api.post('/subscribe');

      const { sessionId } = response.data;

      const stripe = await getStripeJs();

      await stripe.redirectToCheckout({ sessionId });
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <button type="button" className={styles.subscribeButton} onClick={handleSubscribe}>
      Subscribe now
    </button>
  );
}
