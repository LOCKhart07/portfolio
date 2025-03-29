import React, { useEffect, useState } from 'react';
import './Skills.css';
import { getSkills } from '../queries/getSkills';

import { FaReact } from 'react-icons/fa';
import { Skill } from '../types';

import * as FaIcons from "react-icons/fa";
import * as SiIcons from "react-icons/si";



const DynamicIcon = ({ iconName }: { iconName: string }) => {
  let IconComponent;
  if (iconName.startsWith("Si")) {
    IconComponent = SiIcons[iconName as keyof typeof SiIcons];
  } else if (iconName.startsWith("Fa")) {
    IconComponent = FaIcons[iconName as keyof typeof FaIcons];
  } else { return <FaReact /> }

  if (!IconComponent) {
    return <FaReact />
  }

  return <IconComponent />;
};


const Skills: React.FC = () => {

  const [skillsData, setSkillsData] = useState<Skill[]>([]);

  useEffect(() => {
    async function fetchSkills() {
      const data = await getSkills();
      setSkillsData(data);
    }

    fetchSkills()
  }, []);

  if (skillsData.length === 0) return <div>Loading...</div>;

  const skillsByCategory = skillsData.reduce((acc: any, skill: any) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {});


  return (

    <div className="skills-container">
      {Object.keys(skillsByCategory).map((category, index) => (
        <div key={index} className="skill-category">
          <h3 className="category-title">{category}</h3>
          <div className="skills-grid">
            {skillsByCategory[category].map((skill: any, idx: number) => (
              <div key={idx} className="skill-card">
                <div className="icon">
                  {/* {iconMap[skill.icon] || <FaReact />} */}
                  <DynamicIcon iconName={skill.icon} />
                </div>
                <h3 className="skill-name">
                  {skill.name.split('').map((letter: any, i: number) => (
                    <span key={i} className="letter" style={{ animationDelay: `${i * 0.05}s` }}>
                      {letter}
                    </span>
                  ))}
                </h3>
                <p className="skill-description">{skill.description}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Skills;
