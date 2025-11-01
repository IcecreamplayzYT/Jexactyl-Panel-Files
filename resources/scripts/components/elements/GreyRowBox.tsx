import tw from 'twin.macro';
import styled from 'styled-components/macro';

export default styled.div<{ $hoverable?: boolean }>`
    ${tw`flex rounded no-underline text-neutral-200 items-center p-4 border border-transparent transition-colors duration-150 overflow-hidden`};
    background-color: rgba(38, 38, 38, 0.1);

    ${(props) => props.$hoverable !== false && tw`hover:border-neutral-700`};

    & .icon {
        ${tw`rounded-full w-16 flex items-center justify-center bg-neutral-500 p-3`};
    }
`;
