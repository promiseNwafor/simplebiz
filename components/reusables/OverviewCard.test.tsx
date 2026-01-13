import { describe, it, expect } from 'vitest'
import { render, screen } from '@/test-utils'
import OverviewCard from '@/components/reusables/OverviewCard'

describe('OverviewCard', () => {
  it('should render label and title', () => {
    render(<OverviewCard label='Test Label' title='Test Title' />)
    
    expect(screen.getByText('Test Label')).toBeInTheDocument()
    expect(screen.getByText('Test Title')).toBeInTheDocument()
  })

  it('should apply custom className', () => {
    const { container } = render(
      <OverviewCard
        label='Test'
        title='Test'
        className='custom-class'
      />
    )
    
    expect(container.firstChild).toHaveClass('custom-class')
  })
})
