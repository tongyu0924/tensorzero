import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import type {
  VariantConfig,
  BestOfNSamplingConfig,
  DiclConfig,
  MixtureOfNConfig,
} from "~/utils/config/variant";
import { Code } from "~/components/ui/code";
import { Link } from "react-router";
import { FunctionInfo } from "~/components/function/FunctionInfo";
import type { FunctionType } from "~/utils/config/function";
import { VariantLink } from "~/components/function/variant/VariantLink";

interface BasicVariantInfoProps {
  variantConfig: VariantConfig;
  function_name: string;
  function_type: FunctionType;
}

interface TemplateFieldProps {
  title: string;
  content: string;
}

function TemplateField({ title, content }: TemplateFieldProps) {
  return (
    <div className="col-span-2">
      <dt className="text-lg font-semibold">{title}</dt>
      {!content ? (
        <dd className="text-sm text-muted-foreground">None</dd>
      ) : (
        <dd>
          <Collapsible>
            <CollapsibleTrigger className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
              <ChevronDown className="h-4 w-4" />
              Show full template
            </CollapsibleTrigger>
            <CollapsibleContent>
              <pre className="max-h-[500px] overflow-auto rounded-md bg-muted p-4">
                <code className="text-sm">{content}</code>
              </pre>
            </CollapsibleContent>
          </Collapsible>
        </dd>
      )}
    </div>
  );
}

interface BaseFieldProps {
  title: string;
  content?: string | number;
  href?: string;
}

function BaseField({ title, content, href }: BaseFieldProps) {
  if (content === undefined) {
    return null;
  }

  return (
    <div>
      <dt className="text-lg font-semibold">{title}</dt>
      <dd>
        {href ? (
          <Link to={href} className="block no-underline">
            <Code>{content}</Code>
          </Link>
        ) : typeof content === "number" ? (
          content
        ) : (
          <Code>{content}</Code>
        )}
      </dd>
    </div>
  );
}

interface FunctionFieldProps {
  title: string;
  functionName: string;
  functionType: FunctionType;
}

function FunctionField({
  title,
  functionName,
  functionType,
}: FunctionFieldProps) {
  return (
    <div>
      <dt className="text-lg font-semibold">{title}</dt>
      <FunctionInfo functionName={functionName} functionType={functionType} />
    </div>
  );
}

function BaseFields({
  weight,
  model,
  temperature,
  top_p,
  max_tokens,
  presence_penalty,
  frequency_penalty,
  function_name,
  function_type,
  seed,
}: {
  weight: number;
  model: string;
  temperature?: number;
  top_p?: number;
  max_tokens?: number;
  presence_penalty?: number;
  frequency_penalty?: number;
  function_name: string;
  function_type: FunctionType;
  seed?: number;
}) {
  return (
    <>
      <FunctionField
        title="Function"
        functionName={function_name}
        functionType={function_type}
      />
      <BaseField title="Weight" content={weight} />
      <BaseField title="Model" content={model} />
      <BaseField title="Temperature" content={temperature} />
      <BaseField title="Top P" content={top_p} />
      <BaseField title="Max Tokens" content={max_tokens} />
      <BaseField title="Presence Penalty" content={presence_penalty} />
      <BaseField title="Frequency Penalty" content={frequency_penalty} />
      <BaseField title="Seed" content={seed} />
    </>
  );
}

export default function BasicVariantInfo({
  variantConfig,
  function_name,
  function_type,
}: BasicVariantInfoProps) {
  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="text-xl">Basic Information</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="grid grid-cols-2 gap-4">
          {/* Type */}
          <div>
            <dt className="text-lg font-semibold">Type</dt>
            <dd>
              <Code>{variantConfig.type}</Code>
            </dd>
          </div>

          {/* --- CHAT COMPLETION --- */}
          {variantConfig.type === "chat_completion" && (
            <>
              <BaseFields
                function_name={function_name}
                function_type={function_type}
                weight={variantConfig.weight}
                model={variantConfig.model}
                temperature={variantConfig.temperature}
                top_p={variantConfig.top_p}
                max_tokens={variantConfig.max_tokens}
                presence_penalty={variantConfig.presence_penalty}
                frequency_penalty={variantConfig.frequency_penalty}
                seed={variantConfig.seed}
              />

              <TemplateField
                title="System Template"
                content={
                  variantConfig.system_template?.content ??
                  variantConfig.system_template?.path ??
                  ""
                }
              />
              <TemplateField
                title="User Template"
                content={
                  variantConfig.user_template?.content ??
                  variantConfig.user_template?.path ??
                  ""
                }
              />
              <TemplateField
                title="Assistant Template"
                content={
                  variantConfig.assistant_template?.content ??
                  variantConfig.assistant_template?.path ??
                  ""
                }
              />
            </>
          )}

          {/* --- BEST OF N SAMPLING --- */}
          {variantConfig.type === "experimental_best_of_n_sampling" &&
            (() => {
              const config = variantConfig as BestOfNSamplingConfig;
              return (
                <>
                  <BaseFields
                    function_name={function_name}
                    function_type={function_type}
                    weight={config.weight}
                    model={config.evaluator.model}
                    temperature={config.evaluator.temperature}
                    top_p={config.evaluator.top_p}
                    max_tokens={config.evaluator.max_tokens}
                    presence_penalty={config.evaluator.presence_penalty}
                    frequency_penalty={config.evaluator.frequency_penalty}
                    seed={config.evaluator.seed}
                  />
                  <div>
                    <dt className="text-lg font-semibold">Timeout</dt>
                    <dd>{config.timeout_s}s</dd>
                  </div>
                  <div className="col-span-2">
                    <dt className="text-lg font-semibold">Candidates</dt>
                    <dd>
                      {config.candidates.map((candidate) => (
                        <>
                          <VariantLink
                            variantName={candidate}
                            functionName={function_name}
                          >
                            <Code>{candidate}</Code>
                          </VariantLink>
                        </>
                      ))}
                    </dd>
                  </div>
                </>
              );
            })()}

          {/* --- DYNAMIC IN-CONTEXT LEARNING --- */}
          {variantConfig.type === "experimental_dynamic_in_context_learning" &&
            (() => {
              const config = variantConfig as DiclConfig;
              return (
                <>
                  <BaseFields
                    function_name={function_name}
                    function_type={function_type}
                    weight={config.weight}
                    model={config.model}
                    temperature={config.temperature}
                    top_p={config.top_p}
                    max_tokens={config.max_tokens}
                    presence_penalty={config.presence_penalty}
                    frequency_penalty={config.frequency_penalty}
                    seed={config.seed}
                  />
                  <div>
                    <dt className="text-lg font-semibold">Embedding Model</dt>
                    <dd>
                      <Code>{config.embedding_model}</Code>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-lg font-semibold">k (Neighbors)</dt>
                    <dd>{config.k}</dd>
                  </div>
                  <TemplateField
                    title="System Instructions"
                    content={
                      config.system_instructions?.content ??
                      config.system_instructions?.path ??
                      ""
                    }
                  />
                </>
              );
            })()}

          {/* --- MIXTURE OF N --- */}
          {variantConfig.type === "experimental_mixture_of_n" &&
            (() => {
              const config = variantConfig as MixtureOfNConfig;
              return (
                <>
                  <BaseFields
                    function_name={function_name}
                    function_type={function_type}
                    weight={config.weight}
                    model={config.fuser.model}
                    temperature={config.fuser.temperature}
                    top_p={config.fuser.top_p}
                    max_tokens={config.fuser.max_tokens}
                    presence_penalty={config.fuser.presence_penalty}
                    frequency_penalty={config.fuser.frequency_penalty}
                    seed={config.fuser.seed}
                  />
                  <div>
                    <dt className="text-lg font-semibold">Timeout</dt>
                    <dd>{config.timeout_s}s</dd>
                  </div>
                  <div className="col-span-2">
                    <dt className="text-lg font-semibold">Candidates</dt>
                    <dd>
                      {config.candidates.map((candidate) => (
                        <>
                          <VariantLink
                            variantName={candidate}
                            functionName={function_name}
                          >
                            <Code>{candidate}</Code>
                          </VariantLink>
                        </>
                      ))}
                    </dd>
                  </div>
                </>
              );
            })()}
        </dl>
      </CardContent>
    </Card>
  );
}
