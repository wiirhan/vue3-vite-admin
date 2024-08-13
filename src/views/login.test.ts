import { mount } from '@vue/test-utils'
import { ElButton, ElCheckbox, ElForm, ElFormItem, ElInput } from 'element-plus'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import Login from './login.vue'

// Mock the required modules
vi.mock('@/api/login', () => ({
  getCodeImg: vi.fn(() =>
    Promise.resolve({
      captchaEnabled: true,
      img: 'test-image',
      uuid: 'test-uuid',
    }),
  ),
}))

vi.mock('@/store/modules/user', () => ({
  useUserStore: vi.fn(() => ({
    login: vi.fn(() => Promise.resolve()),
  })),
}))

vi.mock('vue-router', () => ({
  useRoute: vi.fn(() => ({ query: {} })),
  useRouter: vi.fn(() => ({ push: vi.fn() })),
}))

describe('Login Component', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('renders correctly', () => {
    const wrapper = mount(Login, {
      global: {
        components: { ElForm, ElFormItem, ElInput, ElButton, ElCheckbox },
        stubs: ['router-link'],
      },
    })

    expect(wrapper.find('.login').exists()).toBe(true)
    expect(wrapper.find('.title').text()).toBe('若依后台管理系统')
    expect(wrapper.findAll('input').length).toBe(4) // username, password, code, remember
    expect(wrapper.find('button').text()).toBe('登 录')
  })

  it('updates form data when input changes', async () => {
    const wrapper = mount(Login, {
      global: {
        components: { ElForm, ElFormItem, ElInput, ElButton, ElCheckbox },
        stubs: ['router-link'],
      },
    })

    const usernameInput = wrapper.findComponent({ name: 'ElInput' })
    await usernameInput.setValue('testuser')

    expect((wrapper.vm as any).loginForm.username).toBe('testuser')
  })

  it('calls handleLogin when login button is clicked', async () => {
    const wrapper = mount(Login, {
      global: {
        components: { ElForm, ElFormItem, ElInput, ElButton, ElCheckbox },
        stubs: ['router-link'],
      },
    })

    const loginButton = wrapper.find('button')
    await loginButton.trigger('click')
  })
})
