import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { founderNoteContent } from '../data/founder';

const FoundersNote: React.FC = () => {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const offsetX = event.clientX - rect.left;
    const offsetY = event.clientY - rect.top;
    const rotateX = ((offsetY / rect.height) - 0.5) * -8;
    const rotateY = ((offsetX / rect.width) - 0.5) * 8;
    setTilt({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  const handleImageError = (event: React.SyntheticEvent<HTMLImageElement>) => {
    const img = event.currentTarget;
    const url = img.currentSrc || img.src;

    fetch(url, { method: 'HEAD' })
      .then((response) => {
        console.error('Founder image failed to load', {
          status: response.status,
          url,
        });
      })
      .catch((error) => {
        console.error('Founder image failed to load', {
          status: 'unavailable',
          url,
          error: error instanceof Error ? error.message : String(error),
        });
      });
  };

  const headingLines = useMemo(() => founderNoteContent.heading.split('\n'), []);

  return (
    <section className="relative overflow-hidden border-t border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.16),transparent_30%),linear-gradient(135deg,#0d0b12_0%,#17121f_45%,#0e1118_100%)] px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-[-10%] top-8 h-56 w-56 rounded-full bg-amber-200/10 blur-3xl" />
        <div className="absolute bottom-[-8%] right-[-5%] h-64 w-64 rounded-full bg-stone-200/10 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10 blur-3xl" />
      </div>

      <div className="relative mx-auto flex max-w-7xl flex-col gap-10 lg:gap-14">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="max-w-3xl"
        >
          <p className="mb-4 text-[0.72rem] uppercase tracking-[0.45em] text-stone-400">
            {founderNoteContent.label}
          </p>
          <h2 className="text-3xl font-semibold leading-[1.05] text-stone-100 sm:text-4xl lg:text-6xl">
            {headingLines.map((line, index) => (
              <span key={line} className="block">
                {line}
                {index === 0 && <span className="mt-2 block h-px w-24 bg-gradient-to-r from-amber-200/60 to-transparent" />}
              </span>
            ))}
          </h2>
        </motion.div>

        <div className="grid items-center gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.75, ease: 'easeOut' }}
            className="space-y-6"
          >
            <div className="space-y-4 text-[1rem] leading-8 text-stone-300 sm:text-[1.05rem]">
              {founderNoteContent.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="rounded-[2rem] border border-white/10 bg-white/8 p-5 shadow-[0_20px_70px_rgba(0,0,0,0.25)] backdrop-blur-xl"
            >
              <p className="font-[cursive] text-3xl text-amber-100 sm:text-4xl" style={{ fontFamily: 'Brush Script MT, Lucida Handwriting, cursive' }}>
                {founderNoteContent.signature}
              </p>
              <p className="mt-2 text-sm uppercase tracking-[0.35em] text-stone-400">
                {founderNoteContent.role}
              </p>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="relative mx-auto flex w-full max-w-[470px] items-center justify-center"
          >
            <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-amber-300/20 via-transparent to-stone-200/20 blur-3xl" />
            <motion.div
              style={{ rotateX: tilt.x, rotateY: tilt.y }}
              whileHover={{ scale: 1.01, y: -6, transition: { duration: 0.25 } }}
              className="relative w-full overflow-hidden rounded-[2.5rem] border border-white/20 bg-white/10 p-3 shadow-[0_40px_120px_rgba(0,0,0,0.35)] backdrop-blur-xl"
            >
              <div className="absolute inset-0 rounded-[2.5rem] border border-amber-100/20" />
              <img
                src={founderNoteContent.imageUrl}
                alt="Founder of May Secret"
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
                onError={handleImageError}
                className="h-[360px] w-full rounded-[2rem] object-cover object-center sm:h-[440px] lg:h-[520px]"
              />
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="grid gap-4 md:grid-cols-2 xl:grid-cols-4"
        >
          {founderNoteContent.values.map((value, index) => (
            <motion.article
              key={value.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: 0.06 * index }}
              whileHover={{ y: -5, scale: 1.01 }}
              className="rounded-[1.6rem] border border-white/10 bg-white/10 p-5 shadow-[0_12px_50px_rgba(0,0,0,0.2)] backdrop-blur-xl"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-xl">
                {value.icon}
              </div>
              <h3 className="text-[1rem] font-semibold text-stone-100">{value.title}</h3>
              <p className="mt-2 text-sm leading-7 text-stone-400">{value.description}</p>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FoundersNote;
