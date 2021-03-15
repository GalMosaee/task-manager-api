const {calculateTip, celsiusToFahrenheit,fahrenheitToCelsius,add} = require('./math')

//Test function allow us to create tests. 2 arguments needed:
//First: test name.
//Second: the testing logic. If the test throw error than the test failed, otherwise success.
//Another way is to use assertion to validate the tests. These assertion called expects.
//The syntax for expect function is: expect(TESTED_VALUE).toBe(EXPECTED_VALUE).
//There are a lot of expect method and .VALIDATION method (not only toBe()) could be found in docs.
//If there is validation no error thrown, if there isn't error will be thrown (with detailed message).
test('Should calculate total with tip',()=>expect(calculateTip(10,.3)).toBe(13))

test('Should calculate total with default tip',()=>expect(calculateTip(10)).toBe(12.5))

test('Should convert 32 F to 0 C',()=>expect(fahrenheitToCelsius(32)).toBe(0))

test('Should convert 0 C to 32 F', ()=>expect(celsiusToFahrenheit(0)).toBe(32))

//When testing async function it's important to know that the test may finish before the async
//function we want to test. As a result the test may show wrong testing results.
//Example for bad async function test:
// test('Async test demo', (done)=>{
//     setTimeout(()=>{
//         expect(1).toBe(2)
//         done()
//     },2000)
// })

//To handle that, there 2 appraoches:
//First: we need to send a callback method called done to the test function and calls
//this function after all tests done.
test('Should add 2 numbers',(done)=>{
    add(2,3).then((sum)=>{
        expect(sum).toBe(5)
        done()
    })
})

//Second: set the test method as async function and calls the async function with await (better option).
test('Should add 2 numbers async/await',async()=>{
    const sum = await add(10,22)
    expect(sum).toBe(32)
})