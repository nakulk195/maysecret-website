import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Image, MessageCircle, X } from 'lucide-react';
import { testimonials } from '../data/testimonials';
import type { Testimonial } from '../data/testimonials';

const getInitials = (name: string) =>
  name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

const StarRating: React.FC<{ rating: number | null }> = ({ rating }) => {
  if (!rating) {
    return null;
  }

  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} star rating`}>
      {Array.from({ length: rating }).map((_, index) => (
        <span key={index} className="text-sm text-amber-400">
          *
        </span>
      ))}
    </div>
  );
};

const TestimonialImage: React.FC<{
  testimonial: Testimonial;
  onOpen: () => void;
}> = ({ testimonial, onOpen }) => {
  const [hasImage, setHasImage] = useState(true);

  return (
    <button
      type="button"
      onClick={hasImage ? onOpen : undefined}
      disabled={!hasImage}
      className="group relative h-44 w-full overflow-hidden rounded-2xl border border-rose-100 bg-gradient-to-br from-rose-50 via-white to-stone-50 text-left shadow-inner disabled:cursor-default sm:h-48"
      aria-label={
        hasImage
          ? `Open full WhatsApp review screenshot from ${testimonial.customerName}`
          : `Review screenshot placeholder for ${testimonial.customerName}`
      }
    >
      {hasImage ? (
        <>
          <img
            src={testimonial.image}
            alt={`WhatsApp customer review screenshot from ${testimonial.customerName}`}
            loading="lazy"
            decoding="async"
            onError={() => setHasImage(false)}
            className="h-full w-full object-cover object-top transition duration-500 group-hover:scale-[1.03]"
          />
          <span className="absolute bottom-3 right-3 rounded-full bg-white/92 px-3 py-1.5 text-xs font-semibold text-stone-800 shadow-md backdrop-blur">
            Read full review
          </span>
        </>
      ) : (
        <span className="flex h-full flex-col items-center justify-center px-5 text-center">
          <Image className="mb-3 h-8 w-8 text-rose-300" aria-hidden="true" />
          <span className="text-sm font-semibold text-stone-800">Screenshot pending</span>
          <span className="mt-1 text-xs leading-5 text-stone-500">
            Add this customer's WhatsApp review image to show the original feedback.
          </span>
        </span>
      )}
    </button>
  );
};

const TestimonialCard: React.FC<{
  testimonial: Testimonial;
  onOpen: () => void;
}> = ({ testimonial, onOpen }) => {
  return (
    <motion.article
      whileHover={{ y: -5 }}
      transition={{ duration: 0.25 }}
      className="flex h-full min-h-[430px] flex-col rounded-3xl border border-rose-100 bg-white p-4 shadow-[0_18px_55px_rgba(190,24,93,0.08)] sm:p-5"
    >
      <TestimonialImage testimonial={testimonial} onOpen={onOpen} />

      <div className="mt-5 flex flex-1 flex-col">
        <div className="mb-4 flex items-center justify-between gap-3">
          <StarRating rating={testimonial.rating} />
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
            <MessageCircle className="h-3.5 w-3.5" />
            {testimonial.badge}
          </span>
        </div>

        {testimonial.quote ? (
          <blockquote className="text-sm leading-7 text-stone-700 sm:text-base">
            "{testimonial.quote}"
          </blockquote>
        ) : (
          <p className="rounded-2xl border border-dashed border-rose-200 bg-rose-50/60 p-4 text-sm leading-6 text-stone-600">
            Exact customer words pending. Add only the review text that is clearly visible in the screenshot.
          </p>
        )}

        <div className="mt-auto pt-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-rose-100 to-amber-50 text-sm font-bold text-rose-700">
              {getInitials(testimonial.customerName)}
            </div>
            <div className="min-w-0">
              <h3 className="truncate text-base font-semibold text-stone-950">
                {testimonial.customerName}
              </h3>
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-stone-500">
                {testimonial.product || 'Product pending'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
};

const ReviewModal: React.FC<{
  activeIndex: number | null;
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
}> = ({ activeIndex, onClose, onNext, onPrevious }) => {
  const testimonial = activeIndex === null ? null : testimonials[activeIndex];

  useEffect(() => {
    if (!testimonial) {
      return undefined;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }

      if (event.key === 'ArrowRight') {
        onNext();
      }

      if (event.key === 'ArrowLeft') {
        onPrevious();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [testimonial, onClose, onNext, onPrevious]);

  if (!testimonial) {
    return null;
  }

  const currentIndex = activeIndex ?? 0;
  const displayIndex = currentIndex + 1;

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-stone-950/80 px-4 py-6 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={`Full review screenshot from ${testimonial.customerName}`}
    >
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        onClick={onClose}
        aria-label="Close review modal"
      />

      <div className="relative flex max-h-full w-full max-w-4xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="flex items-center justify-between gap-3 border-b border-stone-100 px-4 py-3 sm:px-5">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-stone-950">
              {testimonial.customerName}
            </p>
            <p className="text-xs text-stone-500">Original customer review screenshot</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-stone-100 text-stone-700 transition hover:bg-stone-200"
            aria-label="Close full review"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex min-h-0 flex-1 items-center justify-center bg-stone-50 p-3 sm:p-6">
          <img
            src={testimonial.image}
            alt={`Full WhatsApp customer review screenshot from ${testimonial.customerName}`}
            className="max-h-[72vh] w-auto rounded-2xl object-contain shadow-lg"
          />
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-stone-100 px-4 py-3 sm:px-5">
          <button
            type="button"
            onClick={onPrevious}
            className="inline-flex min-h-11 items-center gap-2 rounded-full bg-stone-100 px-4 py-2 text-sm font-semibold text-stone-800 transition hover:bg-stone-200"
          >
            <ArrowLeft className="h-4 w-4" />
            Previous
          </button>
          <span className="text-xs font-medium text-stone-500">
            {displayIndex} / {testimonials.length}
          </span>
          <button
            type="button"
            onClick={onNext}
            className="inline-flex min-h-11 items-center gap-2 rounded-full bg-stone-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-stone-800"
          >
            Next
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

const CustomerTestimonials: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const testimonialCount = testimonials.length;

  const modalActions = useMemo(
    () => ({
      next: () =>
        setActiveIndex((current) =>
          current === null ? current : (current + 1) % testimonialCount
        ),
      previous: () =>
        setActiveIndex((current) =>
          current === null ? current : (current - 1 + testimonialCount) % testimonialCount
        ),
    }),
    [testimonialCount]
  );

  return (
    <section className="overflow-hidden bg-gradient-to-b from-white via-rose-50/50 to-white px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.6 }}
          className="mb-8 text-center sm:mb-12"
        >
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.28em] text-rose-500">
            Real customer feedback
          </p>
          <h2 className="text-3xl font-semibold text-stone-950 sm:text-4xl lg:text-5xl">
            Loved by Our Customers
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-stone-600 sm:text-base">
            Real experiences. Real skin journeys. Real MaySecret love.
          </p>
        </motion.div>

        <div className="-mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-4 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 md:gap-5 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: index * 0.04 }}
              className="w-[86vw] max-w-[360px] shrink-0 snap-center sm:w-auto sm:max-w-none"
            >
              <TestimonialCard
                testimonial={testimonial}
                onOpen={() => setActiveIndex(index)}
              />
            </motion.div>
          ))}
        </div>
      </div>

      <ReviewModal
        activeIndex={activeIndex}
        onClose={() => setActiveIndex(null)}
        onNext={modalActions.next}
        onPrevious={modalActions.previous}
      />
    </section>
  );
};

export default CustomerTestimonials;
