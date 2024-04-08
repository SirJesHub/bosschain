import React, { useState, useEffect } from "react";



export default function content() {  

    const data: any = {
        htmlContent:
          '<div><h1>Welcome to My Website!</h1><p>This is a paragraph of <strong>bold text</strong> and <em>italic text</em>.</p><h2>About Me</h2><p><img src="profile.jpg" alt="Profile Picture" />I am a web developer passionate about creating amazing websites and applications.</p><h2>My Projects</h2><h3>Project 1: Personal Blog</h3><p>My personal blog where I share my thoughts and experiences.</p><h3>Project 2: Portfolio Website</h3><p>A portfolio website showcasing my work and skills.</p><h2>Skills</h2><ul><li>HTML</li><li>CSS</li><li>JavaScript</li><li>React</li><li>Node.js</li></ul><h2>Contact Me</h2><p>',
      };

  const [content, setContent] = useState("");

  useEffect(() => {
    // Fetch text editor content from the server when the component mounts
    fetchTextEditorContent();
  }, []);

  const fetchTextEditorContent = async () => {
    try {
      const response = data.htmlContent; // Assuming you have an API endpoint to fetch text editor content
      setContent(response);
    } catch (error) {
      console.error("Error fetching text editor content:", error);
    }
  };

  const renderTextContent = () => {
    // Render the text content as HTML
    return <div dangerouslySetInnerHTML={{ __html: content }} />;
  };

  return (
    <div>
      <h1>Online Text Editor</h1>
      {renderTextContent()}
    </div>
  );
}

