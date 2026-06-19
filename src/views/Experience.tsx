import { useState, useEffect } from 'react';
import { useLanguage } from '../LanguageContext.js';
import { motion } from 'motion/react';
import { Briefcase, GraduationCap, Calendar, Activity, ChevronRight, Award } from 'lucide-react';

export default function Experience() {
  const { lang, t } = useLanguage();
  const [milestones, setMilestones] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const careerMilestones = [
    {
      periodEn: '2025 - Present',
      periodFr: '2025 - Présent',
      roleEn: 'Full Stack Developer (Freelance)',
      roleFr: 'Développeur Full Stack (Freelance)',
      company: 'Self-employed / Consulting',
      descriptionEn: 'Architecting custom visual content management systems, responsive landing matrices, and robust database microservices for high-velocity startups. Managing deployment scaling pipelines using Docker containers on Cloud ecosystems.',
      descriptionFr: 'Conception de systèmes de gestion de contenu visuels sur-mesure, de matrices de capture d’audience réactives et de microservices de bases de données sécurisés pour des start-ups. Orchestration des déploiements via des conteneurs Docker.',
      skills: ['React 19', 'Node.js', 'Express', 'Mongoose', 'Tailwind CSS', 'Docker'],
      type: 'work'
    },
    {
      periodEn: '2024 - 2025',
      periodFr: '2024 - 2025',
      roleEn: 'Junior Full Stack Engineer (Apprentice)',
      roleFr: 'Ingénieur Full Stack Junior (Apprenti)',
      company: 'Tech Dynamics SAS',
      descriptionEn: 'Collaborated with engineering squads on designing API gateways, improving security protections, and writing modular frontend state controllers. Reduced bundle sizes by 28% and enhanced SEO ratings across multiple product screens.',
      descriptionFr: 'Collaboration active au sein d’équipes d’ingénierie sur le développement de passerelles d’API, le renforcement de la sécurité des sessions et l’écriture de contrôleurs d’états modulaires. Réduction de taille des bundles de 28.',
      skills: ['TypeScript', 'Next.js Router', 'PostgreSQL', 'Sequelize', 'REST APIs', 'Git'],
      type: 'work'
    },
    {
      periodEn: '2022 - 2024',
      periodFr: '2022 - 2024',
      roleEn: 'Advanced Degree in Computer Science',
      roleFr: 'Diplôme d’Études Supérieures en Informatique',
      company: 'Institut Technologique Supérieur',
      descriptionEn: 'Rigorous academic research around data complexity limits, relational schema structures, indexing configurations, and object-oriented architectures. Excelled in collaborative hackathons and open source collectives.',
      descriptionFr: 'Formation académique rigoureuse axée sur la complexité algorithmique, la modélisation relationnelle (normalisation SQL), l’écriture d’architectures logicielles orientées objet et des hackathons collectifs.',
      skills: ['Data Structures', 'C++', 'Relational Database', 'Tailwind CSS', 'Software Design'],
      type: 'education'
    }
  ];

  useEffect(() => {
    // Dynamic SEO titles based on active language
    const title = lang === 'fr'
      ? 'Expérience & Parcours professionnel | Grégoire BATCHO'
      : 'Professional Experience & Career path | Grégoire BATCHO';
    document.title = title;

    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', lang === 'fr'
        ? 'Curriculum vitæ et jalons professionnels de Grégoire BATCHO. Apprentissages en ingénierie logiciel, gestion d’API REST, et développement d’applications web.'
        : 'Curriculum Vitae and professional milestones of Grégoire BATCHO. Core work, apprentice scopes, database schemas, and micro-frontend layers.'
      );
    }

    fetch('/api/experiences')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          // Sort by order/date if needed
          setMilestones(data);
        } else {
          setMilestones(careerMilestones);
        }
      })
      .catch((err) => {
        console.error('Error fetching experiences:', err);
        setMilestones(careerMilestones);
      })
      .finally(() => setLoading(false));
  }, [lang]);

  return (
    <div className="relative min-h-screen pt-28 pb-16 px-4 md:px-8 max-w-4xl mx-auto">
      {/* Background ambient light */}
      <div className="glow-spot w-[350px] h-[350px] bg-copper-600/5 top-24 left-1/2 -translate-x-1/2" />

      {/* Title */}
      <section className="space-y-4 mb-16 text-center">
        <div className="inline-flex items-center space-x-2 text-copper-400 text-xs font-mono tracking-widest uppercase">
          <span className="w-3 h-px bg-copper-400" />
          <span>{lang === 'fr' ? 'Parcours & Jalons' : 'Track & Milestones'}</span>
          <span className="w-3 h-px bg-copper-400" />
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-display text-white tracking-tight">
          {t.experienceTitle}
        </h2>
        <p className="text-zinc-500 text-xs sm:text-sm max-w-xl mx-auto">
          {t.experienceSubtitle}
        </p>
      </section>

      {/* Timeline Layout */}
      <section className="relative border-l border-white/5 pl-6 sm:pl-10 space-y-12 ml-2 sm:ml-6 z-10">
        
        {/* Animated continuous glow track */}
        <div className="absolute top-0 bottom-0 left-0 w-px bg-gradient-to-b from-copper-500 via-copper-600/30 to-transparent" />

        {milestones.map((milestone, idx) => (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, delay: idx * 0.1 }}
            key={idx}
            className="relative space-y-3"
          >
            {/* Interactive Timeline indicator node */}
            <div className={`absolute -left-[31px] sm:-left-[47px] top-1.5 w-4 h-4 rounded-full border-2 bg-black flex items-center justify-center shadow-lg transition-transform duration-300 hover:scale-110 ${
              milestone.type === 'work' 
                ? 'border-copper-500 shadow-copper-500/20' 
                : 'border-amber-400 shadow-amber-400/20'
            }`}>
              <div className={`w-1.5 h-1.5 rounded-full ${
                milestone.type === 'work' ? 'bg-copper-400' : 'bg-amber-400'
              }`} />
            </div>

            {/* Content card */}
            <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-4 shadow-xl hover:border-copper-500/15 transition-all duration-300">
              
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-white/5 pb-3">
                
                {/* Role and Company */}
                <div className="space-y-1">
                  <h3 className="font-display font-semibold text-white text-base">
                    {lang === 'fr' ? milestone.roleFr : milestone.roleEn}
                  </h3>
                  <div className="flex items-center space-x-2 text-zinc-400 text-xs font-medium">
                    {milestone.type === 'work' ? (
                      <Briefcase className="w-3.5 h-3.5 text-copper-400 shrink-0" />
                    ) : (
                      <GraduationCap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    )}
                    <span>{milestone.company}</span>
                  </div>
                </div>

                {/* Date period */}
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-950 text-[10px] font-mono text-zinc-400 border border-white/5 self-start sm:self-center">
                  <Calendar className="w-3 h-3 text-zinc-500" />
                  <span>{lang === 'fr' ? milestone.periodFr : milestone.periodEn}</span>
                </span>
              </div>

              {/* Description body */}
              <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
                {lang === 'fr' ? milestone.descriptionFr : milestone.descriptionEn}
              </p>

              {/* Skills checklist */}
              {milestone.skills && milestone.skills.length > 0 && (
                <div className="space-y-2 pt-2">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider flex items-center gap-1 leading-none">
                    <ChevronRight className="w-3 h-3 text-copper-500" />
                    <span>{lang === 'fr' ? 'Compétences mobilisées' : 'Acquired Skillsets'}</span>
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {milestone.skills.map((skill: string, sIdx: number) => (
                      <span key={sIdx} className="px-2.5 py-1 rounded-lg bg-zinc-950 text-zinc-400 font-mono text-[10px] border border-white/5">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

            </div>

          </motion.div>
        ))}

        {/* Ending decorative capsule */}
        <div className="inline-flex items-center space-x-2 pl-4 text-[10px] font-mono text-zinc-600 tracking-wider uppercase">
          <Award className="w-4.5 h-4.5 text-copper-500/50" />
          <span>{lang === 'fr' ? 'Suite à écrire avec vous.' : 'Continually expanding.'}</span>
        </div>

      </section>

    </div>
  );
}
