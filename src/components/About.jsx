import React from 'react';
import Star from '../assets/star.png';

const About = () => {
    return (
        <div className="flex text-black justify-center items-center py-12 px-24 h-[600px]">
            <div className="flex-1 mr-4 p-8 bg-gray-300 rounded-lg">
                <p className="text-lg">Sound Coven exists to bring out the voice of student artists and support them in reaching their audience, collaborating with producers, and expanding their fanbase. With our PR services, tools for self-promotion, and streamlined artist-to-industry connections, SoundCoven creates a unique space for talent to grow.</p>
                <hr className="my-4 border-black" />
                <h2 className="text-4xl font-bold mb-4">Who Are We</h2>
                <hr className="my-4 border-black" />
                <h2 className="text-4xl font-bold mb-4">How We Help</h2>
            </div>
            <div className="flex-1 flex justify-center items-center">
                <img src={Star} alt="Star" className="w-[300px]" />
            </div>
        </div>
    );
};

export default About;