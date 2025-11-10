from app.agent.base_agent import BaseAgent
from app.agent.research_agent.config import load_research_agent_config
from app.agent.research_agent.state import ResearchAgentState, ResearchAgentInputState, ResearchAgentOutputState
from app.agent.research_agent.model import ResearchGenerationResponse
from app.common.llm import get_llm
from typing import Any
from langgraph.graph import StateGraph, START, END
from langchain_core.messages import SystemMessage, HumanMessage


class ResearchAgent(BaseAgent):
    def __init__(self):
        self._config = load_research_agent_config()
        self._prompt_config = self._config.RESEARCH_ANALYZER

        super().__init__("Research Agent", None)

        self.name = "Research Agent"
        self.llm = self._create_llm()

    def _create_llm(self) -> Any:
        """Create and configure the LLM instance."""
        temperature = getattr(self._prompt_config, "temperature", 0)
        model_name = self._prompt_config.model

        # Create and return the LLM using the common utility
        llm = get_llm(model_name=model_name, temperature=temperature)

        # Add structured output if needed
        llm_with_structure = llm.with_structured_output(ResearchGenerationResponse)

        return llm_with_structure

    async def _research_node(self, state: ResearchAgentState) -> dict:
        """Node that performs the research task."""
        user_input = state.get("user_input", "")

        # Build messages for the LLM
        messages = []

        # Add system prompt if available
        if self._prompt_config.system_prompt:
            messages.append(SystemMessage(content=self._prompt_config.system_prompt))

        # Add user prompt
        if self._prompt_config.user_prompt_template:
            user_content = self._prompt_config.user_prompt_template.format(user_input=user_input)
        else:
            user_content = user_input

        messages.append(HumanMessage(content=user_content))

        # Invoke the LLM
        response: ResearchGenerationResponse = await self.llm.ainvoke(messages)

        # Return the updated state
        return {
            "research_summary": response.processing_summary or "",
            "research_documents": response.research_document or "",
            "messages": messages
        }

    async def build_agent(self) -> StateGraph:
        """Build the Research Agent graph."""
        # Create the state graph
        workflow = StateGraph(
            ResearchAgentState,
            input=ResearchAgentInputState,
            output=ResearchAgentOutputState
        )

        # Add the research node
        workflow.add_node("research", self._research_node)

        # Define the flow: START -> research -> END
        workflow.add_edge(START, "research")
        workflow.add_edge("research", END)

        # Compile the graph
        self.agent = workflow.compile()

        return self.agent

    async def invoke(self, data: Any) -> Any:
        """Invoke the Research Agent on input data."""
        # Ensure the agent is built
        if self.agent is None:
            await self.build_agent()

        # Prepare the input state
        if isinstance(data, dict):
            input_state = data
        else:
            input_state = {"user_input": str(data)}

        # Invoke the agent
        result = await self.agent.ainvoke(input_state)

        return result