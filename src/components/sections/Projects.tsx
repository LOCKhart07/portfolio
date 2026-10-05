import React from 'react';
import './Projects.css';
import { FaReact, FaNodeJs, FaAws, FaDatabase, FaDocker, FaAngular, FaGithub, FaGitlab, FaGoogle, FaJava, FaJenkins, FaMicrosoft, FaPython, FaVuejs, FaYoutube, FaJs, FaSatelliteDish, FaMicrochip } from 'react-icons/fa';
import { SiRubyonrails, SiPostgresql, SiMongodb, SiMaterialdesign, SiHtml5, SiCss3, SiJquery, SiAwsamplify, SiFirebase, SiTerraform, SiArgo, SiFlask, SiNginx, SiOracle, SiCloudflare, SiSelenium, SiGoogletranslate, SiFirefox, SiRider, SiSpotify, SiFastapi, SiRedis, SiGooglegemini, SiLangchain, SiDatocms, SiKotlin, SiAndroid, SiGradle, SiGithubactions, SiSqlite, SiSocketdotio, SiTypescript, SiSvelte, SiHono, SiDrizzle, SiTailwindcss } from 'react-icons/si';
import type { Project } from '../../types/types';
import { GrDeploy, GrKubernetes } from "react-icons/gr";

// DatoCMS assets are Imgix-backed. The raw `image.url` is a 2x portfolio-card
// PNG (~300-360KB each, 8 eager on the page ≈ 2.6MB). Request a compressed,
// width-capped, auto-format (AVIF/WebP) rendition instead: `auto=format`
// negotiates the best format the browser accepts, `auto=compress` picks an
// optimal quality, `fit=max` never upscales. Cards render at most ~550px wide,
// so 900px covers high-DPI without shipping the full 2x asset.
const cardImage = (url: string): string => {
  const sep = url.includes('?') ? '&' : '?';
  return `${url}${sep}auto=format,compress&w=900&fit=max`;
};

const techIcons: { [key: string]: JSX.Element } = {
  "ReactJS": <FaReact />,
  "NodeJS": <FaNodeJs />,
  "AWS": <FaAws />,
  "PostgreSQL": <SiPostgresql />,
  "MongoDB": <SiMongodb />,
  "Ruby On Rails": <SiRubyonrails />,
  "Material UI": <SiMaterialdesign />,
  "HTML5": <SiHtml5 />,
  "CSS3": <SiCss3 />,
  "jQuery": <SiJquery />,
  "AWS-ECS": <SiAwsamplify />,
  'Cognito': <FaAws />,
  'Lambda': <FaAws />,
  'ECS': <FaAws />,
  'Jenkins': <FaJenkins />,
  'Docker': <FaDocker />,
  'GraphQL': <FaDatabase />,
  'CI/CD': <FaGitlab />,
  'GitLab': <FaGitlab />,
  'GitHub': <FaGithub />,
  'Heroku': <GrDeploy />,
  'Netlify': <GrDeploy />,
  'Firebase': <SiFirebase />,
  'GCP': <FaGoogle />,
  'Azure': <FaMicrosoft />,
  'Kubernetes': <GrKubernetes />,
  'Terraform': <SiTerraform />,
  'ArgoCD': <SiArgo />,
  'Java': <FaJava />,
  'Spring Boot': <FaJava />,
  'Python': <FaPython />,
  'Node.js': <FaNodeJs />,
  'Express.js': <FaNodeJs />,
  'Hibernate': <FaJava />,
  'Maven': <FaJava />,
  'Gradle': <SiGradle />,
  'Kotlin': <SiKotlin />,
  'Android': <SiAndroid />,
  'Room': <SiSqlite />,
  'GitHub Actions': <SiGithubactions />,
  'JUnit': <FaJava />,
  'Mockito': <FaJava />,
  'Jest': <FaReact />,
  'React': <FaReact />,
  'Angular': <FaAngular />,
  'Vue.js': <FaVuejs />,
  'Next.js': <FaReact />,
  'Gatsby': <FaReact />,
  'Nuxt.js': <FaVuejs />,
  'Redux': <FaReact />,
  'Vuex': <FaVuejs />,
  'Tailwind CSS': <SiCss3 />,
  'Bootstrap': <SiCss3 />,
  'JQuery': <SiJquery />,
  'Flask': <SiFlask />,
  'Nginx': <SiNginx />,
  "OCI": <SiOracle />,
  "Cloudflare": <SiCloudflare />,
  "Selenium": <SiSelenium />,
  "YouTube API": <FaYoutube />,
  "Google Translate API": <SiGoogletranslate />,
  "JavaScript": <FaJs />,
  "Browser Extensions": <SiFirefox />,
  "Real-Debrid API": <SiRider />,
  "Spotify API": <SiSpotify />,
  "FastAPI": <SiFastapi />,
  "Redis": <SiRedis />,
  "Gemini": <SiGooglegemini />,
  "LangChain": <SiLangchain />,
  'DatoCMS': <SiDatocms />,
  'Socket.IO': <SiSocketdotio />,
  'SSE': <FaSatelliteDish />,
  'On-device LLM': <FaMicrochip />,
  'TypeScript': <SiTypescript />,
  'Svelte': <SiSvelte />,
  'Hono': <SiHono />,
  'SQLite': <SiSqlite />,
  'Drizzle': <SiDrizzle />,
  'Tailwind': <SiTailwindcss />,
  'Cloudflare R2': <SiCloudflare />
};


interface ProjectsProps {
  // Typed loosely on purpose: a CMS hiccup / changed field permissions can
  // return null instead of an array, which used to blank the whole route.
  projects: Project[] | null | undefined;
}

// Rendered at build time from DatoCMS data (see pages/profile/[persona]/projects.astro);
// ships no JS. Cards with a link are real anchors; the delegated data-track
// listener reports the click.
const Projects: React.FC<ProjectsProps> = ({ projects: data }) => {
  const projects = Array.isArray(data) ? data : [];
  if (projects.length === 0) {
    return <div className="projects-container">No projects to show yet.</div>;
  }

  return (
    <div className="projects-container">
      <div className="projects-grid">
        {projects.map((project, index) => {
          const Card = project.link ? 'a' : 'div';
          const linkProps = project.link
            ? { href: project.link, target: '_blank', rel: 'noopener noreferrer' }
            : {};
          return (
            <Card
              key={index}
              className="project-card"
              style={{ '--delay': `${index * 0.1}s` } as React.CSSProperties}
              data-track={`Project|Click|${project.title}`}
              {...linkProps}
            >
              {project.image?.url ? (
                <img
                  src={cardImage(project.image.url)}
                  alt={project.title}
                  className="project-image"
                  width={550}
                  height={200}
                  loading="lazy"
                  decoding="async"
                />
              ) : (
                <div className="project-image project-image-fallback" aria-hidden="true">
                  {project.title?.charAt(0) ?? '★'}
                </div>
              )}
              <div className="project-details">
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <div className="tech-used">
                  {(project.techUsed ?? '').split(', ').filter(Boolean).map((tech: string, i: number) => (
                    <span key={i} className="tech-badge">
                      {techIcons[tech] || "🔧"} {tech}
                    </span>
                  ))}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Projects;
