# Space Game!

Play at http://rdgoetz.github.io/spacegame/

This project is an experiment to see if the WEBrtc network stack can be used in a p2p networked action game.

Game state synchronization is done by each client running two simulations, one from networked data and one from local state. Game objects are strictly owned by either the local or network sim. For a player's local state, there's 3 sources of events that can modify the simulation: user input, local game events, and remote game events. For a player's network state, the only source of events that can modify the simulation come from the network.

As a simple example, issuing a 'shoot' event locally adds a bullet object to the local simulation, and broadcasts out this event to all peers network simulation. Upon recieving the event, the network state adds the object with the given intial state and then continues the simulation.

Collisions are handled by each client's local state. For the bullet example above, all objects owned by the local state are checked for collisions with the network state. If the bullet collides with an object, then this triggers two events: one for the local state (remove bullet) and one for the networked state (do damage).

In the local case, the object is removed from the local state, and this removal is broadcast to all peers. All peers then also remove the bullet from their network sim.

For the networked object, the event is sent only to the peer that owns this object. The peer then recievs this change and modifies their local state. Again, by modifying the local state, this change is broadcasted out all peers.

This means that as a player, you instantly see your bullet hit the opponent, but have to wait for the full round trip before seeing the effect of the bullet hitting the ship.

For things like movement and firing weapons, the player again sees instant updates, and all peers wait only for the half-trip to update the game state.

Of course, this architecture is vulnerable to lag causing ghosting or one client seeing that they dodged a bullet but then taking damage anyway.

The network sim attempts to mitigate this by extrapolating and interpolating objects so that when state updates do come in the simulation appears to continue normally.

I'm also looking to improve it by using time to linearly interpolate objects, meaning that so long as clocks are in sync most objects are at the same position for the same timestamp. There's lots of improvements that can be made, but this is mostly just a research/side project, so small desyncs aren't that worrying.
