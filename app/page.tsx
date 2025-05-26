"use client"

import {
  Engine,
  Render,
  Bodies,
  Runner,
  Composite,
  Common,
  World
} from 'matter-js'

import { useEffect, useRef } from 'react';

export default function Home() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const engineRef = useRef<Engine | null>(null);
    const runnerRef = useRef<Runner | null>(null);
    const worldRef = useRef<World | null>(null);

    const pixelRatioRef = useRef(1);

    useEffect(() => {
        const engine = Engine.create()
        
        engineRef.current = engine;
        worldRef.current = engine.world;
        
        const canvas = canvasRef.current;
        if (!canvas) return;

        pixelRatioRef.current = window.devicePixelRatio;
        const render = Render.create({
            canvas: canvas,
            engine: engine,
            options: {
                width: window.innerWidth,
                height: window.innerHeight,
                background: 'transparent',
                wireframes: false,
                hasBounds: true,
                pixelRatio: pixelRatioRef.current,
            }
        })

        Render.run(render);

        const box = Bodies.rectangle(400, 200, 80, 80, {
            restitution: 0.5, friction: 0.5, angle: Common.random(0, 360)});

        const ground = Bodies.rectangle(400, 610, 810, 60, { isStatic: true });

        Composite.add(worldRef.current, [box, ground]);

        const runner = Runner.create();
        runnerRef.current = runner;

        Runner.run(runner, engine);
       

        return () => {
            console.log("Cleaning up Matter.js resources");
            Render.stop(render);
            Runner.stop(runnerRef.current as Runner);
            Engine.clear(engineRef.current as Engine);
            render.canvas.remove();
            render.textures = {};
            Composite.clear(worldRef.current as World, false);
        }

    }, []);
    

     return (
    <canvas ref={canvasRef} style={{ display: 'block', width: '100vw', height: '100vh' }} />
    );
}