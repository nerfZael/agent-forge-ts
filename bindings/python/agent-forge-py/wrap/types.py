# NOTE: This is an auto-generated file. All modifications will be overwritten.
# type: ignore
from __future__ import annotations

from typing import Any, TypedDict, Optional
from enum import IntEnum

from polywrap import (
    Uri,
    Client,
    GenericMap,
    PolywrapClient,
    PolywrapClientConfigBuilder,
    sys_bundle,
    web3_bundle
)


### Env START ###

### Env END ###

### Objects START ###

### Objects END ###

### Enums START ###
### Enums END ###

### Imported Objects START ###

# URI: "wrap://ipfs/QmYLVSZRufudohsya2nuEDs9HR4xnr4g2a6qceEpx8kRUf" #
AgentStep = TypedDict("AgentStep", {
    "state": str,
    "output": Optional[str],
}, total=False)

### Imported Objects END ###

### Imported Enums START ###


### Imported Enums END ###

### Imported Modules START ###

# URI: "wrap://ipfs/QmYLVSZRufudohsya2nuEDs9HR4xnr4g2a6qceEpx8kRUf" #
AgentModuleArgsMain = TypedDict("AgentModuleArgsMain", {
    "args": list[str],
}, total=False)

# URI: "wrap://ipfs/QmYLVSZRufudohsya2nuEDs9HR4xnr4g2a6qceEpx8kRUf" #
AgentModuleArgsRun = TypedDict("AgentModuleArgsRun", {
    "goal": str,
}, total=False)

# URI: "wrap://ipfs/QmYLVSZRufudohsya2nuEDs9HR4xnr4g2a6qceEpx8kRUf" #
AgentModuleArgsRunStep = TypedDict("AgentModuleArgsRunStep", {
    "input": Optional[str],
    "state": str,
}, total=False)

# URI: "wrap://ipfs/QmYLVSZRufudohsya2nuEDs9HR4xnr4g2a6qceEpx8kRUf" #
class Agent:
    _default_client: Client
    _default_uri: Uri
    _default_env: Optional[Any]

    def __init__(
        self,
        client: Optional[Client] = None,
        env: Optional[Any] = None,
        uri: Optional[Uri] = None,
    ):
        self._default_client = self._get_client(client)
        self._default_uri = self._get_uri(uri)
        self._default_env = self._get_env(env)

    def _get_client(self, client: Optional[Client]) -> Client:
        return client or getattr(self, "_default_client", None) or self._get_default_client()

    def _get_uri(self, uri: Optional[Uri]) -> Uri:
        return uri or getattr(self, "_default_uri", None) or self._get_default_uri() 

    def _get_env(self, env: Optional[Any]) -> Any:
        return env or getattr(self, "_default_env", None) or self._get_default_env()

    def _get_default_client(self) -> Client:
        config = (
            PolywrapClientConfigBuilder()
            .add_bundle(sys_bundle)
            .add_bundle(web3_bundle)
            .build()
        )
        return PolywrapClient(config)

    def _get_default_uri(self) -> Optional[Uri]:
        return Uri.from_str("wrap://ipfs/QmYLVSZRufudohsya2nuEDs9HR4xnr4g2a6qceEpx8kRUf")

    def _get_default_env(self) -> Any:
        return None

    def main(
        self,
        args: AgentModuleArgsMain,
        client: Optional[Client] = None,
        env: Optional[Any] = None,
        uri: Optional[Uri] = None,
    ) -> int:
        _client = self._get_client(client)
        _env = self._get_env(env)
        _uri = self._get_uri(uri)

        return _client.invoke(
            uri=_uri,
            method="main",
            args=args,
            env=_env,
        )

    def run(
        self,
        args: AgentModuleArgsRun,
        client: Optional[Client] = None,
        env: Optional[Any] = None,
        uri: Optional[Uri] = None,
    ) -> "AgentStep":
        _client = self._get_client(client)
        _env = self._get_env(env)
        _uri = self._get_uri(uri)

        return _client.invoke(
            uri=_uri,
            method="run",
            args=args,
            env=_env,
        )

    def run_step(
        self,
        args: AgentModuleArgsRunStep,
        client: Optional[Client] = None,
        env: Optional[Any] = None,
        uri: Optional[Uri] = None,
    ) -> "AgentStep":
        _client = self._get_client(client)
        _env = self._get_env(env)
        _uri = self._get_uri(uri)

        return _client.invoke(
            uri=_uri,
            method="runStep",
            args=args,
            env=_env,
        )

### Imported Modules END ###
