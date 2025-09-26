# Idealizer - AI-Powered Startup Idea Analysis Platform

A comprehensive platform for evaluating startup ideas using AI-powered analysis frameworks including SWOT analysis, BCG Matrix, Business Model Canvas, and more.

## Features

- **Multi-Input Analysis**: Upload PDFs, images, or enter text descriptions
- **AI-Powered Frameworks**: SWOT, BCG Matrix, Business Model Canvas, and custom metrics
- **Interactive Dashboard**: Compare multiple ideas with charts and rankings
- **Professional Reports**: Generate branded PDF reports with analysis results
- **Budget Estimation**: Get cost estimates for 100-day prototyping

## Setup

### Environment Variables

1. Copy the environment variables template:
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`

2. Add your Anthropic Claude API key to `.env.local`:
   \`\`\`env
   ANTHROPIC_API_KEY=your_anthropic_api_key_here
   \`\`\`

   Get your API key from [Anthropic Console](https://console.anthropic.com/)

### Installation

1. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

2. Run the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. **Submit an Idea**: Use the analyze page to upload files, images, or enter text descriptions
2. **Add Metadata**: Provide key features, value proposition, and background information
3. **Select Frameworks**: Choose which analysis frameworks to apply
4. **Review Results**: Get comprehensive analysis with actionable insights
5. **Compare Ideas**: Use the dashboard to compare multiple analyzed ideas

## Analysis Frameworks

- **SWOT Analysis**: Strengths, Weaknesses, Opportunities, Threats
- **BCG Matrix**: Market growth vs market share positioning
- **Business Model Canvas**: Complete business model breakdown
- **Custom Metrics**: Desirability, Viability, Feasibility, Sustainability
- **Budget Analysis**: Cost estimation and resource planning

## Technology Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **AI**: Vercel AI SDK with Anthropic Claude Sonnet
- **Charts**: Recharts for data visualization
- **UI Components**: shadcn/ui component library
