import { render, screen, fireEvent } from '@testing-library/react';
import EquippedShield from './EquippedShield';

const impact = (id, kind, shield = 5, shieldRank = 0) => ({ id, kind, shield, shieldRank });
const shieldCard = () => document.querySelector('.Player-shield:not(.shield-shatter) [data-test="card"]');

describe('EquippedShield Component', () => {
  it('renders nothing without a shield', () => {
    const { container } = render(<EquippedShield shield={0} shieldRank={0} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('does not replay an impact that happened before it mounted', () => {
    render(<EquippedShield shield={5} shieldRank={3} impact={impact(1, 'absorbed')} />);
    expect(shieldCard()).not.toHaveClass('shield-recoil');
  });

  it('recoils when the shield absorbs a hit', () => {
    const { rerender } = render(<EquippedShield shield={5} shieldRank={0} />);
    rerender(<EquippedShield shield={5} shieldRank={3} impact={impact(1, 'absorbed')} />);
    expect(shieldCard()).toHaveClass('shield-recoil');
  });

  it('does not recoil a newly equipped shield for a hit on the old one', () => {
    const { rerender } = render(<EquippedShield shield={5} shieldRank={0} />);
    rerender(<EquippedShield shield={5} shieldRank={3} impact={impact(1, 'absorbed')} />);
    rerender(<EquippedShield shield={8} shieldRank={0} impact={impact(1, 'absorbed')} />);
    expect(shieldCard()).not.toHaveClass('shield-recoil');
  });

  it('shatters the old shield when it breaks, then clears it', () => {
    const { rerender } = render(<EquippedShield shield={5} shieldRank={3} />);
    rerender(<EquippedShield shield={0} shieldRank={0} impact={impact(1, 'broken', 5, 3)} />);

    const shattered = screen.getByTestId('shattered-shield');
    expect(shattered.querySelectorAll('.shield-shard')).toHaveLength(2);
    expect(shattered).toHaveTextContent('5');

    fireEvent.animationEnd(shattered.querySelector('.shield-shard-right'));
    expect(screen.queryByTestId('shattered-shield')).toBeNull();
  });
});
