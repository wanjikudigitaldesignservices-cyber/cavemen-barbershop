import React from 'react';
import { Target, Award, Armchair, Repeat } from 'lucide-react';
import { siteConfig } from '../config/siteConfig';

export default function WhyChooseUs({ content }) {
  const iconMap = {
    "01": Target,
    "02": Award,
    "03": Armchair,
    "04": Repeat,
  };

  return (
    <section className="relative py-24 sm:py-32 bg-cavemen-charcoal border-t border-b border-white/5">
      
      {/* Background ambient subtle accent */}
      <div className="absolute bottom-0 right-10 w-96 h-96 bg-cavemen-bronze/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-20 space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-[1px] bg-cavemen-bronze" />
            <span className="text-xs uppercase tracking-[0.25em] text-cavemen-bronze font-semibold">
              The CAVEMEN Code
            </span>
          </div>

          <h2 className="font-cinzel text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-cavemen-offwhite uppercase">
            {content?.title || 'BUILT AROUND YOUR STANDARD.'}
          </h2>

          <p className="font-sans text-sm sm:text-base text-cavemen-softgrey font-light leading-relaxed">
            We reject the rushed, impersonal assembly-line haircut. Our entire establishment was constructed around four uncompromising tenets of masculine grooming.
          </p>
        </div>

        {/* 4 Principles Grid - Typography & Minimal Geometric Elements */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {siteConfig.principles.map((principle) => {
            const Icon = iconMap[principle.number] || Target;

            return (
              <div
                key={principle.number}
                className="group relative bg-cavemen-card/90 border border-white/5 p-8 flex flex-col justify-between hover:border-cavemen-bronze/50 transition-all duration-500 shadow-sm hover:shadow-xl"
              >
                {/* Top: Large Typography-led Numerals & Minimal Icon */}
                <div>
                  <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
                    <span className="font-cinzel text-3xl sm:text-4xl font-bold text-cavemen-bronze/70 group-hover:text-cavemen-bronze transition-colors">
                      {principle.number}
                    </span>

                    <div className="w-9 h-9 rounded-none border border-white/10 flex items-center justify-center text-cavemen-softgrey group-hover:text-cavemen-bronze group-hover:border-cavemen-bronze/40 transition-colors bg-cavemen-black/50">
                      <Icon className="w-4 h-4 stroke-[1.5]" />
                    </div>
                  </div>

                  {/* Title & Core Description */}
                  <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-cavemen-offwhite mb-3 group-hover:text-cavemen-bronzeLight transition-colors">
                    {principle.title}
                  </h3>

                  <p className="font-sans text-sm text-cavemen-offwhite/90 font-medium mb-3">
                    {principle.description}
                  </p>

                  <p className="font-sans text-xs text-cavemen-softgrey leading-relaxed font-light">
                    {principle.elaboration}
                  </p>
                </div>

                {/* Bottom Subtle Accent Indicator */}
                <div className="mt-8 pt-4">
                  <div className="w-6 h-[1.5px] bg-cavemen-bronze/40 group-hover:w-16 group-hover:bg-cavemen-bronze transition-all duration-500" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Editorial Quote Banner */}
        <div className="mt-20 p-8 sm:p-10 border border-cavemen-bronze/20 bg-cavemen-black/40 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="font-cinzel text-lg sm:text-xl text-cavemen-offwhite font-bold">
              Expect Excellence At Every Visit.
            </h4>
            <p className="text-xs text-cavemen-softgrey font-sans">
              No rushed chairs. No inconsistent fades. Just pure craftsmanship.
            </p>
          </div>

          <div className="flex items-center space-x-2 text-cavemen-bronze text-xs tracking-widest uppercase font-semibold font-cinzel">
            <span>Precision</span>
            <span>•</span>
            <span>Style</span>
            <span>•</span>
            <span>Ritual</span>
          </div>
        </div>

      </div>
    </section>
  );
}
