import babel from   "@rollup/plugin-babel";
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import resolve from '@rollup/plugin-node-resolve';
 
  
import replace from "@rollup/plugin-replace";
import typescript from 'rollup-plugin-typescript2';

import terser from "@rollup/plugin-terser";

const config = {
    input: 'src/main.tsx',
 
    output: [
        {
            
            file: 'lib/linkedinbadge.js',
            // cdn format
            format: 'umd',
            name: 'LinkedInBadge',
               
            globals: {
                react: 'React',
                'react-dom/client': 'ReactDOM'          
            
            },
            sourcemap:'inline'

        }
    ],
    plugins: [

        
        typescript({ useTsconfigDeclarationDir: true ,
            sourceMap: true,
        }),
        peerDepsExternal(),
        babel({
            exclude: 'node_modules/**',
            babelHelpers: 'external',
            presets: [
                "@babel/preset-env",
                "@babel/preset-react",
                "@babel/preset-typescript"
            ],
        }),
        resolve(),
    
        replace({
            "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV)
        }),
    
    
        terser( {
            format:{
              comments: "all",
              preamble: `${process.env.CDN_PREAMBLE_COMMENTARY_NOTICE || "/* LinkedInBadge */"}`
            }
          }),
        
    ],


    external: ['react', 'react-dom/client', 'react-dom'],
};

export default config;
