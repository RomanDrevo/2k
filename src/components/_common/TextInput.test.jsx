import React from 'react'
import TextInput from './TextInput'


describe('TextInput component', () => {
  it('Should render TextInput', () => {
    let result = ''
    const onChange = jest.fn((e) => {
      console.log(e)
      result = e
    })
    const component = shallow(<TextInput onChange={onChange} />)
    // console.log( component.debug() )
    // const source = {
    //   clipboardData: {
    //     getData: () => 'qwerty'
    //   }
    // }
    // expect( component ).toMatchSnapshot()
    expect(component.find('input').exists())
    // const input = component.find('input').get(0)
    // console.log(input)
    // component.find('input').simulate('paste', source)
    component.find('input').simulate('change', { target: { value: 'qwerty' } })
    // expect(onChange).to.have.property('callCount', 1)
    expect(onChange).toHaveBeenCalled()
    // component.find('input').simulate('keydown', { which: 'a' })
    // input.simulate('keydown', { which: 'a' })
    // console.log(component.state())
    expect(component.state().value).toEqual(result)
    expect(result).toEqual('qwerty')
  })
})
