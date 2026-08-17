import { Bubble } from './Bubble';

interface Props {
  greeting: string;
  intro: string;
}

export default function TopBubble({ greeting, intro }: Props) {
  const text = `${greeting} ${intro}`;
  return (
    <section class="hero wrap" style={{ position: 'relative' }}>
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <Bubble
          size={40}
          trail={18}
          follow={0.6}
          blend={16}
          refraction={100}
          dispersion={1.5}
          tint={[0.64, 0.39, 0.95]}
          tintStrength={0.3}
          colorA={[0.64, 0.39, 0.95]}
          colorB={[0.67, 0.14, 0.37]}
          iridescence={1.2}
          shine={0.4}
          style={{ height: '100%' }}
        >
          <div style={{ width: '100%', height: '100%' }} />
        </Bubble>
      </div>
      <div style={{ position: 'relative', zIndex: 1 }}>
        <h1 class="hero__title">{text}</h1>
      </div>
    </section>
  );
}
