import { notFound } from 'next/navigation';

const data: Record<string, { title: string; dek: string; body: string[] }> = {
  'srad-flight-computer': {
    title: 'SRAD Flight Computer, Dual‑Deploy',
    dek: 'A custom avionics stack with EKF‑based state estimation and reliable dual‑deployment at apogee and main.',
    body: [
      'Built around a Teensy platform, the avionics integrates IMU and barometer inputs, fusing them via an Extended Kalman Filter to estimate altitude/velocity robustly in the presence of sensor noise and transient loads.',
      'Controls gunpowder charges for main and drogue deployment.',
    ]
  },
  'contraction-metrics': {
    title: 'Neural Stochastic Contraction Metrics at UTIAS',
    dek: '-.',
    body: [
      '',
    ]
  },
  'blank1': {
    title: '575',
    dek: 'veggie maki roll',
    body: [
      'i found a good place to eat',
      'though the salad’s bad.'
 
    ]
  },
  'blank2': {
    title: 'Coming soon!',
    dek: '',
    body: [
      ''
    ]
  }
};

export default function ProjectArticle({ params }: { params: { slug: string } }){
  const item = data[params.slug];
  if (!item) return notFound();
  return (
        <main className="container with-nav-offset">
    <article className="article container">
      <header>
        <h1>{item.title}</h1>
        <p className="desc">{item.dek}</p>
      </header>
      <div className="content">
        {item.body.map((p, i) => <p key={i}>{p}</p>)}
      </div>
    </article>
    </main>
  );
}
