// Can’t even do this because jest imports things differently than the normal compilation thing and this fails.
//import './App';

test('jest runs at all', () => {
});

// This is necessary to get our file to be treated as a module by the build process
export {};
