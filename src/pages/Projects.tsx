import React, { useEffect, useState } from 'react';
import './Projects.css';
import { FaReact, FaNodeJs, FaAws, FaDatabase, FaDocker, FaAngular, FaGithub, FaGitlab, FaGoogle, FaJava, FaJenkins, FaMicrosoft, FaPython, FaVuejs, FaYoutube, FaJs } from 'react-icons/fa';
import { SiRubyonrails, SiPostgresql, SiMongodb, SiMaterialdesign, SiHtml5, SiCss3, SiJquery, SiAwsamplify, SiFirebase, SiTerraform, SiArgo, SiFlask, SiNginx, SiOracle, SiCloudflare, SiSelenium, SiGoogletranslate, SiFirefox, SiRider, SiSpotify, SiFastapi, SiRedis, SiGooglegemini, SiLangchain, SiDatocms, SiKotlin, SiAndroid, SiGradle, SiGithubactions, SiSqlite } from 'react-icons/si';
import { Project } from '../types/types';
import { getProjects } from '../queries/getProjects';
import { GrDeploy, GrKubernetes } from "react-icons/gr";
import { trackEvent } from '../hooks/usePageTracking';

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
  'DatoCMS': <SiDatocms />
};


const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([])
  const [status, setStatus] = useState<'loading' | 'error' | 'ready'>('loading');

  useEffect(() => {
    let active = true;
    async function fetchProjects() {
      try {
        const data = await getProjects();
        if (!active) return;
        // A CMS hiccup / changed field permissions can return null/undefined
        // instead of an array. Don't setState a non-array — `.length`/`.map`
        // in render would throw and blank the route.
        setProjects(Array.isArray(data) ? data : []);
        setStatus('ready');
      } catch {
        if (active) setStatus('error');
      }
    }

    fetchProjects();
    return () => {
      active = false;
    };
  }, [])

  if (status === 'loading') {
    return <div className="projects-container">Loading...</div>;
  }
  if (status === 'error') {
    return (
      <div className="projects-container">
        Couldn&apos;t load projects right now. Please try again later.
      </div>
    );
  }
  if (projects.length === 0) {
    return <div className="projects-container">No projects to show yet.</div>;
  }
  const handleProjectClick = (project: Project) => {
    trackEvent('Project', 'Click', project.title);
    if (project.link) {
      window.open(project.link, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="projects-container">
      <div className="projects-grid">
        {projects.map((project, index) => (
          <div
            key={index}
            className="project-card"
            style={{ '--delay': `${index * 0.1}s` } as React.CSSProperties}
            onClick={() => handleProjectClick(project)}
          >
            {project.image?.url ? (
              <img src={project.image.url} alt={project.title} className="project-image" />
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
          </div>
        ))}
      </div>
    </div>
  );
};

export default Projects;
